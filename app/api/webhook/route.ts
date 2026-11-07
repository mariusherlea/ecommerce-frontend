// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY)
    throw new Error('STRIPE_SECRET_KEY is missing');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: Request) {
  const stripe = getStripe();

  const signature = req.headers.get('stripe-signature');
  if (!signature)
    return new NextResponse('Missing Stripe signature', { status: 400 });

  const body = await req.text();

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Missing STRIPE_WEBHOOK_SECRET', { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('STRIPE SESSION METADATA:', {
      customerName: session.metadata?.customerName,
      customerPhone: session.metadata?.customerPhone,
      shippingAddress: session.metadata?.shippingAddress,
    });

    try {
      if (!process.env.STRAPI_API_URL)
        throw new Error('STRAPI_API_URL missing');
      if (!process.env.STRAPI_API_TOKEN)
        throw new Error('STRAPI_API_TOKEN missing');

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );

      const formattedAddress =
        session.metadata?.shippingAddress ||
        [
          session.customer_details?.address?.line1,
          session.customer_details?.address?.city,
          session.customer_details?.address?.postal_code,
          session.customer_details?.address?.country,
        ]
          .filter(Boolean)
          .join(', ') ||
        null;

      const res = await fetch(`${process.env.STRAPI_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            stripeSessionId: session.id,
            email:
              session.customer_details?.email ?? session.customer_email ?? null,

            phone:
              session.metadata?.customerPhone ??
              session.customer_details?.phone ??
              null,

            address: formattedAddress,
            shippingAddress: formattedAddress,
            total: session.amount_total ? session.amount_total / 100 : 0,
            stare: 'paid',
            items: lineItems.data.map((item) => ({
              name: item.description,
              quantity: item.quantity ?? 0,
              price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            })),
            // dacă ai Draft&Publish activ:
            // publishedAt: new Date().toISOString(),
          },
        }),
      });

      const text = await res.text();
      if (!res.ok)
        console.error('❌ Strapi create order failed:', res.status, text);
      else console.log('✅ Order saved in Strapi:', text);
    } catch (error) {
      console.error('❌ Failed to save order:', error);
    }
  }

  return new NextResponse('OK', { status: 200 });
}
