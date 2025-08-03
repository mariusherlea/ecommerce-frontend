// lib/api.ts
export async function getProducts() {
  const res = await fetch("http://localhost:1337/api/products");
  const data = await res.json();
  return data.data;
}
