//app/cart/page.tsx

'use client';

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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#78a66b] mb-3">
            Fresh food, made easy
          </p>

          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#243b2d]">
                Your Shopping Cart<span className="text-[#78a66b]">.</span>
              </h1>

              <p className="mt-2 text-[#7c8580]">
                Review your fresh choices before checkout.
              </p>
            </div>

            <span className="text-sm text-[#7c8580]">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="bg-white border border-[#e9e8e2] rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#edf3e9] flex items-center justify-center text-4xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold text-[#243b2d] mt-6">
              Your cart is empty
            </h2>

            <p className="text-[#7c8580] mt-3">
              Looks like you haven't added anything fresh yet.
            </p>

            <button
              onClick={() => router.push('/products')}
              className="mt-8 px-8 py-4 rounded-full bg-[#243b2d] text-white font-semibold hover:bg-[#365640] transition"
            >
              Explore our products →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Cart Items */}
            <section>
              <div className="space-y-4">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-[#e9e8e2] rounded-2xl p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      {/* Product */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 shrink-0 rounded-xl bg-[#edf3e9] flex items-center justify-center text-3xl">
                          🥗
                        </div>

                        <div>
                          <h2 className="font-bold text-lg text-[#243b2d]">
                            {item.title}
                          </h2>

                          <p className="text-sm text-[#89918b] mt-1">
                            {formatPrice(item.price)} / item
                          </p>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-[#78a66b] hover:text-[#243b2d] mt-2 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="flex items-center border border-[#e4e8df] rounded-full overflow-hidden">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="w-10 h-10 text-[#243b2d] hover:bg-[#edf3e9] transition font-semibold"
                          >
                            −
                          </button>

                          <span className="w-9 text-center font-semibold text-[#243b2d]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase quantity of ${item.title}`}
                            className="w-10 h-10 text-[#243b2d] hover:bg-[#edf3e9] transition font-semibold"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-lg text-[#243b2d]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Continue Shopping / Clear Cart */}
              <div className="flex flex-wrap justify-between gap-4 mt-6">
                <button
                  onClick={() => router.push('/products')}
                  className="text-sm font-semibold text-[#78a66b] hover:text-[#243b2d] transition"
                >
                  ← Continue shopping
                </button>

                <button
                  onClick={clearCart}
                  className="text-sm text-[#89918b] hover:text-red-600 transition"
                >
                  Empty cart
                </button>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit bg-white border border-[#e9e8e2] rounded-2xl p-6 shadow-sm lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-[#243b2d]">
                Order Summary
              </h2>

              <div className="border-t border-[#eeede8] my-6" />

              <div className="flex justify-between text-sm text-[#7c8580]">
                <span>Items ({totalItems})</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between text-sm text-[#7c8580] mt-4">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-[#eeede8] my-6" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-[#243b2d]">Total</span>

                <span className="text-2xl font-extrabold text-[#243b2d]">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-7 py-4 rounded-full bg-[#243b2d] text-white font-semibold hover:bg-[#365640] transition active:scale-[0.98]"
              >
                Continue to checkout →
              </button>

              <p className="text-center text-xs text-[#9a9f99] mt-5">
                Fresh food. Simple ordering. Secure checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
