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

