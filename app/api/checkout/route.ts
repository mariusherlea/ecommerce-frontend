//app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

    const session = await stripe.checkout.sessions.create({
      // 👇 Stripe decide automat metoda (nu mai trebuie "payment_method_types")
      mode: "payment",

      line_items: cart.map((item: any) => ({
        price_data: {
          currency: "ron",
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),

      // ✅ Culege email + adresă
      customer_creation: "always",
      billing_address_collection: "auto",

      // 👇 Stripe afișează automat câmpul de email
      // (nu mai folosim customer_email: null)

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
