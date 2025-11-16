//app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
     const body = await req.json();
    const {
      cart,
      customer,
    }: {
      cart: { title: string; price: number; quantity: number }[];
      customer?: {
        id?: string;
        stripeCustomerId?: string;
        fullName?: string;
        email?: string;
        phone?: string;
        address?: string;
      };
    } = body;

 if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 🔹 Construim sesiunea dinamic
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["RO", "US", "GB", "DE", "FR"],
      },
      
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

      // 🔹 salvăm detalii custom (sunt vizibile în Dashboard)
     // Metadata — le vei vedea în Stripe Dashboard
        metadata: {
        userId: customer?.id || "",
        fullName: customer?.fullName || "",
        phone: customer?.phone || "",
        email: customer?.email || "",
        address: customer?.address || "",
      },
    };

    // ⭐ precompletare automată pe baza userului
    if (customer?.stripeCustomerId) {
      // dacă avem deja customer creat în Stripe
      sessionData.customer = customer.stripeCustomerId;
    } else if (customer?.email) {
      // altfel, măcar precompletăm emailul
      sessionData.customer_email = customer.email;
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}