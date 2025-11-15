import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { cart, user } = await req.json();

    // 🔹 Construim sesiunea dinamic
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["RO", "US", "GB", "DE", "FR"],
      },
      customer_creation: "always",

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

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    };

    // 🧠 Dacă user-ul este logat → folosim `customer`
    if (user?.stripeCustomerId) {
      sessionData.customer = user.stripeCustomerId;
    } 
    else if (user?.email) {
      // 🔹 Dacă nu are customerId dar are email → Stripe folosește email
      sessionData.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
