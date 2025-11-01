// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

      // ✅ Afișează formular complet de livrare + facturare
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["RO", "HU", "BG", "DE", "NL", "FR", "IT"], // poți modifica lista
      },

      // ✅ Stripe va crea mereu un customer nou și va salva emailul
      customer_creation: "always",

      // ✅ Redirecționări
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
