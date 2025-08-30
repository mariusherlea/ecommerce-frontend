"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Coșul tău</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Coșul este gol.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="border p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p>Cantitate: {item.quantity}</p>
                    <p>Preț: {item.price} lei</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold mb-2">
                      Total: {item.price * item.quantity} lei
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Golește coșul
            </button>
            <div className="text-xl font-bold">
              Total general: {total} lei
            </div>
          </div>
        </>
      )}
    </div>
  );
}
