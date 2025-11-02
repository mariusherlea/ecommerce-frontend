"use client";

import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // 🔥 Golește coșul o singură dată la montare
    clearCart();
  }, []); // 👈 fără clearCart ca dependență (altfel se recalculează la fiecare re-render)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Plata a fost efectuată cu succes!
      </h1>
      <p className="text-gray-700 mb-6">
        Comanda ta a fost procesată și va fi livrată în curând.
      </p>
      <Link
        href="/products"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        🛍️ Continuă cumpărăturile
      </Link>
    </div>
  );
}
