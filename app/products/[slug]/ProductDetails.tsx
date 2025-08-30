
"use client";

import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: any;
  price: number;
  inStock: string;
};

export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-gray-600 mt-4">{product.price} lei</p>
      <p className="mt-4">În stoc: {product.inStock}</p>

      <button
        onClick={() =>
          addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
          })
        }
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Adaugă în coș
      </button>
    </div>
  );
}
