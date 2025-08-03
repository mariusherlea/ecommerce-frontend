"use client";

import { useCart } from "@/context/CartContext";

type AddToCartButtonProps = {
  id: number;
  title: string;
  price: number;
};

export default function AddToCartButton({ id, title, price }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart({ id, title, price });
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Adaugă în coș
    </button>
  );
}
