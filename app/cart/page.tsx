"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart,
      user, // trimitem datele utilizatorului
    }),
  });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirect către Stripe
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Coșul tău</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Coșul este gol.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="border p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p>Preț: {item.price} lei</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    Total: {item.price * item.quantity} lei
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Șterge
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Golește coșul
            </button>
            <div className="text-xl font-bold">
              Total general: {total} lei
            </div>
            <button
            onClick={handleCheckout}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Plătește acum
          </button>
          </div>
        </>
      )}
    </div>
  );
}
