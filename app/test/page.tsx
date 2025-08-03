"use client";

import { useCart } from "@/context/CartContext";

export default function TestPage() {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: 1,
      title: "Produs de test",
      price: 99.99,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pagina de test</h1>
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Adaugă în coș
      </button>
    </div>
  );
}
