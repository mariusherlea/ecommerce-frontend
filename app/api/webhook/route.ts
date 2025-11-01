// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // Stripe needs raw body for signature verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("💰 Payment successful for session:", session.id);

    try {
      // 1️⃣ Luăm lista de produse cumpărate
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // 2️⃣ Extragem emailul și adresa
      let customerEmail = session.customer_email || null;
      let customerAddress = null;

      if (session.customer) {
        const customer = await stripe.customers.retrieve(session.customer as string);
        if (typeof customer !== "string") {
          customerEmail = customer.email || customerEmail;
          customerAddress = customer.address || null;
        }
      }

      // 3️⃣ Construim adresa într-un string lizibil
      const formattedAddress = customerAddress
        ? `${customerAddress.line1 || ""}, ${customerAddress.city || ""}, ${customerAddress.country || ""}`
        : null;

      // 4️⃣ Trimitem comanda către Strapi
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            stripeSessionId: session.id,
            email: customerEmail,
            address: formattedAddress,
            total: session.amount_total ? session.amount_total / 100 : 0,
            stare: "paid",
            items: lineItems.data.map((item) => ({
              name: item.description,
              quantity: item.quantity,
              price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            })),
          },
        }),
      });

      const strapiResponse = await res.json();
      console.log("📦 Răspuns Strapi:", strapiResponse);
    } catch (err) {
      console.error("❌ Eroare salvare comandă în Strapi:", err);
    }
  }

  return new NextResponse("ok", { status: 200 });
}
