'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">The cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p>Price: {formatPrice(item.price)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-9 h-9 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 active:scale-95 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    Total: {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Empty cart
            </button>

            <div className="text-xl font-bold">
              <p>Total general: {formatPrice(total)}</p>
            </div>

            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Continue to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
