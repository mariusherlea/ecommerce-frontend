// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: any; // poți pune PortableText dacă îl randezi
  price: number;
  inStock: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};


async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[slug][$eq]=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  console.log("Strapi response:", data);

  return data.data.length > 0 ? data.data[0] : null;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) return notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-700 mb-4">{product.price} lei</p>
      <p className="text-sm text-gray-500">In stoc: {product.inStock}</p>
    </div>
  );
}
