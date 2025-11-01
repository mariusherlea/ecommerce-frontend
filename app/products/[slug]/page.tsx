//app/products/[slug]/page.tsx
import ProductDetails from "./ProductDetails";

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: any;
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



export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params; // 👈 Next.js 15 requirement

  const product = await getProduct(slug);
  if (!product) return <p className="p-6">Produsul nu a fost găsit.</p>;
return <ProductDetails product={product} />;
}