// app/api/checkout/route.ts
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

  try {
    const body = await req.json();

    // ✅ fix: folosim cart (cum trimite frontend-ul)
    const items = body?.cart;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload. Expected { cart: [...] }' },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL is missing');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            // adaptează la structura ta reală (item.name vs item.title)
            name: item.name ?? item.title ?? 'Product',
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity ?? 1),
      })),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      // (opțional) poți trimite customer info în metadata
      metadata: {
        customerEmail: body?.customer?.email ?? '',
        customerId: body?.customer?.id ? String(body.customer.id) : '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { error: (error as any)?.message ?? 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
