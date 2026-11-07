//app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is missing');
  }

  return new Stripe(secretKey);
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const body = await req.json();

    const items = body?.cart;
    const customer = body?.customer;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid.' },
        { status: 400 },
      );
    }

    if (
      !customer?.name?.trim() ||
      !customer?.email?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please complete all delivery information.' },
        { status: 400 },
      );
    }

    if (customer.address.length > 500) {
      return NextResponse.json(
        { error: 'Delivery address is too long.' },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_SITE_URL is missing');
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);

        if (
          !Number.isFinite(price) ||
          price <= 0 ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error('Invalid cart item.');
        }

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.title ?? item.name ?? 'Product',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        };
      },
    );

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,

      customer_email: customer.email.trim(),

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,

      metadata: {
        customerId: customer.id ? String(customer.id) : '',
        customerName: customer.name.trim(),
        customerPhone: customer.phone.trim(),
        shippingAddress: customer.address.trim(),
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create checkout session',
      },
      { status: 500 },
    );
  }
}
