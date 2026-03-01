// app/api/order-by-session/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const STRAPI_API_URL = process.env.STRAPI_API_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_API_URL) {
    return NextResponse.json(
      { error: 'STRAPI_API_URL missing' },
      { status: 500 },
    );
  }
  if (!STRAPI_API_TOKEN) {
    return NextResponse.json(
      { error: 'STRAPI_API_TOKEN missing' },
      { status: 500 },
    );
  }

  // Strapi v5 filter: filters[field][$eq]=...
  const url = new URL(`${STRAPI_API_URL}/api/orders`);
  url.searchParams.set('filters[stripeSessionId][$eq]', sessionId);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return NextResponse.json(
      { error: 'Failed to fetch order from Strapi', details: text },
      { status: res.status },
    );
  }

  const data = await res.json();

  const order = data?.data?.[0];
  if (!order) {
    return NextResponse.json({ order: null }, { status: 200 });
  }

  // normalize (în funcție de cum e structurat în Strapi)
  const attrs = order.attributes ?? order;

  return NextResponse.json(
    {
      order: {
        id: order.id,
        email: attrs.email ?? null,
        total: attrs.total ?? 0,
        currency: (attrs.currency ?? 'eur').toUpperCase(),
        stare: attrs.stare ?? null,
        items: attrs.items ?? [],
      },
    },
    { status: 200 },
  );
}
