// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string
);

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

    const session = await stripe.checkout.sessions.create({
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

      // ✅ colectăm email și adrese
      customer_creation: "always",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["RO", "DE", "FR", "NL", "IT"],
      },

      // ✅ câmp personalizat — PHONE
      custom_fields: [
        {
          key: "phone",
          label: { type: "custom", custom: "Telefon" },
          type: "text",
          optional: false,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
