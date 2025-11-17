//app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, customer } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const sessionData: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',

      customer_creation: 'always',

      billing_address_collection: 'auto',

      shipping_address_collection: {
        allowed_countries: ['RO', 'BG', 'HU', 'DE', 'FR', 'US'],
      },

      line_items: cart.map((item: any) => ({
        price_data: {
          currency: 'ron',
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,

      metadata: {
        userId: customer?.id || '',
        fullName: customer?.name || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        address: customer?.address || '',
      },
    };

    // 🔹 Precompletare email dacă există
    if (customer?.email) {
      sessionData.customer_email = customer.email;
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    console.log('📨 Checkout received:', body);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('❌ Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
