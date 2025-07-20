// lib/api.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

export async function getProducts() {
  const res = await fetch("http://localhost:1337/api/products");

  console.log("STATUS", res.status); // Adăugat
  const text = await res.text();
  console.log("RAW RESPONSE", text); // Adăugat

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = JSON.parse(text);
  return data.data;
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[slug][$eq]=${slug}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error("Failed to fetch product by slug");

  const data = await res.json();
  return data.data[0]; // primul produs
}
