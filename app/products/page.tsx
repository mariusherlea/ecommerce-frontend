// app/products/page.tsx
import Link from "next/link";

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  price: number;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.data;
}

export default async function ProductsPage() {
  const products = await getProducts();

  if (products.length === 0) {
    return <p className="p-6">Nu există produse disponibile.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Produse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="block border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600 mt-2">{product.price} lei</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

