'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart } = useCart();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.shippingAddress ?? '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          customer: {
            id: user?.id,
            name: fullName,
            email,
            phone,
            address,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to start checkout.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Stripe checkout URL is missing.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl bg-[#faf9f6] border border-[#e5e7df] text-[#243b2d] placeholder:text-[#a0a69f] outline-none focus:border-[#78a66b] focus:ring-2 focus:ring-[#78a66b]/15 transition';

  const labelClass = 'block text-sm font-semibold text-[#354a3c] mb-2';

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-5 py-16">
        <div className="max-w-3xl mx-auto bg-white border border-[#e9e8e2] rounded-3xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#edf3e9] flex items-center justify-center text-4xl">
            🛒
          </div>

          <h1 className="text-3xl font-extrabold text-[#243b2d] mt-6">
            Your cart is empty.
          </h1>

          <p className="text-[#7c8580] mt-3">
            Add some fresh products before checking out.
          </p>

          <button
            onClick={() => router.push('/products')}
            className="mt-8 px-8 py-4 rounded-full bg-[#243b2d] text-white font-semibold hover:bg-[#365640] transition"
          >
            Browse products →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#78a66b] mb-3">
            Fresh food, made easy
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#243b2d]">
            Checkout<span className="text-[#78a66b]">.</span>
          </h1>

          <p className="mt-2 text-[#7c8580]">
            Almost there! Complete your details to enjoy fresh food.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Delivery Information */}
            <section className="bg-white border border-[#e9e8e2] rounded-2xl p-6 sm:p-8 shadow-sm h-fit">
              <div className="mb-7">
                <h2 className="text-xl font-bold text-[#243b2d]">
                  Delivery Information
                </h2>

                <p className="text-sm text-[#89918b] mt-2">
                  Please provide your contact and delivery details.
                </p>
              </div>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+31 6 12345678"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className={labelClass}>
                    Full delivery address
                  </label>

                  <textarea
                    id="address"
                    required
                    rows={4}
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Street, house number, postal code, city, country"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-[#eeede8]">
                <button
                  type="button"
                  onClick={() => router.push('/cart')}
                  className="px-6 py-3.5 rounded-full border border-[#dfe4dc] text-[#354a3c] font-semibold hover:bg-[#f3f5ef] transition"
                >
                  ← Back to cart
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3.5 rounded-full bg-[#243b2d] text-white font-semibold hover:bg-[#365640] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Redirecting to Stripe...'
                    : 'Continue to payment →'}
                </button>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit bg-white border border-[#e9e8e2] rounded-2xl p-6 shadow-sm lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-[#243b2d]">
                Order Summary
              </h2>

              <p className="text-sm text-[#89918b] mt-2">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
              </p>

              <div className="border-t border-[#eeede8] my-6" />

              <div className="space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#354a3c]">
                        {item.title}
                      </p>

                      <p className="text-xs text-[#89918b] mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-[#243b2d] whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#eeede8] my-6" />

              <div className="flex justify-between text-sm text-[#7c8580]">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between text-sm text-[#7c8580] mt-4">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-[#eeede8] my-6" />

              <div className="flex justify-between items-center gap-3">
                <span className="font-bold text-[#243b2d]">Total</span>

                <span className="text-2xl font-extrabold text-[#243b2d]">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#f0f4ec]">
                <p className="text-xs text-[#526b55] leading-relaxed">
                  Your order will be processed securely through Stripe.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
