"use client";

import { useCart } from "../context/CartContext";

type Props = {
  id: number;
  title: string;
  price: number;
};

export function AddToCartButton({ id, title, price }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart({ id, title, price, quantity: 1 })}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Adaugă în coș
    </button>
  );
}
