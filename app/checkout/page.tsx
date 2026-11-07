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

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p>Your cart is empty.</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          <section className="border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-5">Delivery information</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block mb-2">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block mb-2">Phone number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
                  placeholder="+31 6 12345678"
                />
              </div>

              <div>
                <label className="block mb-2">Full delivery address</label>
                <textarea
                  required
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
                  placeholder="Street, house number, postal code, city, country"
                />
              </div>
            </div>
          </section>

          {error && (
            <p className="text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="px-5 py-3 rounded-lg border border-gray-600 hover:bg-gray-800"
            >
              Back to cart
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : 'Continue to payment'}
            </button>
          </div>
        </form>

        <aside className="border border-gray-700 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-5">Order summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 mt-5 pt-5 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
