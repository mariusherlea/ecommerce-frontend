// app/products/page.tsx
import ProductsClient from "./ProductsClient";

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.data;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsClient products={products} />;
}
