import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: Request) {
  const stripe = getStripe();

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new NextResponse('Missing Stripe signature', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );

      const address = session.customer_details?.address;
      const formattedAddress = address
        ? `${address.line1 ?? ''}, ${address.city ?? ''}, ${address.postal_code ?? ''}, ${address.country ?? ''}`
        : null;

      await fetch(`${process.env.STRAPI_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            stripeSessionId: session.id,
            email: session.customer_details?.email ?? null,
            phone: session.customer_details?.phone ?? null,
            address: formattedAddress,
            total: session.amount_total ? session.amount_total / 100 : 0,
            stare: 'paid',
            items: lineItems.data.map((item) => ({
              name: item.description,
              quantity: item.quantity ?? 0,
              price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            })),
          },
        }),
      });

      console.log('✅ Order saved in Strapi');
    } catch (error) {
      console.error('❌ Failed to save order:', error);
    }
  }

  return new NextResponse('OK', { status: 200 });
}
