// app/products/ProductsClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  price: number;
};

export default function ProductsClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");

  if (products.length === 0) {
    return <p className="p-6">Nu există produse disponibile.</p>;
  }

  // 🔎 filtrare produse după titlu
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Produse</h1>

      {/* search box */}
      <input
        type="text"
        placeholder="Caută produse..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500">Niciun produs găsit.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <li
              key={product.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-600">{product.price} lei</p>
              <Link
                href={`/products/${product.slug}`}
                className="text-blue-600 hover:underline block mt-2"
              >
                Vezi detalii →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
