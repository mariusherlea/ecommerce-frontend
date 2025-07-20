//app/products/[slug]/page.tsx
import { getProductBySlug } from "../../../lib/api";
import { notFound } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { AddToCartButton } from "../../../components/AddToCartButton";
import { useEffect } from "react";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-4">${product.price}</p>
      <p>{product.description[0]?.children[0]?.text}</p>

      {/* Adaugă buton */}
      <AddToCartButton
        id={product.id}
        title={product.title}
        price={product.price}
      />
    </div>
  );
}

