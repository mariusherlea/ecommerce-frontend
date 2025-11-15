import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature invalid:", err.message);
    return new NextResponse(`Webhook Error`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      const email = session.customer_details?.email || null;
      const phone = session.customer_details?.phone || null;

      const shipping = session.customer_details?.address || null;

      const formattedAddress = shipping
        ? `${shipping.line1 || ""}, ${shipping.city || ""}, ${shipping.postal_code || ""}, ${shipping.country || ""}`
        : null;

      // Trimitem în Strapi
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            stripeSessionId: session.id,
            email,
            phone,
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
      console.log("📦 Strapi order saved:", strapiResponse);
    } catch (err) {
      console.error("❌ Webhook save error:", err);
    }
  }

  return new NextResponse("ok", { status: 200 });
}
