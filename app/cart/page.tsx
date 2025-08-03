"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Coșul tău</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Coșul este gol.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p>Cantitate: {item.quantity}</p>
                  <p>Preț: {item.price} lei</p>
                </div>
                <p className="text-right font-semibold">
                  Total: {item.price * item.quantity} lei
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="mt-6 text-xl font-bold text-right">
          Total general: {total} lei
        </div>
      )}
    </div>
  );
}
