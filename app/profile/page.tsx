//app/profile/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/formatPrice';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  total: number;
  stare: string;
  createdAt: string;
  items: OrderItem[];
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, jwt, logout, login } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!jwt) {
      router.push('/login');
    }
  }, [jwt, router]);

  useEffect(() => {
    if (!jwt) return;

    let cancelled = false;

    const fetchUserAndOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: 'no-store',
          },
        );

        if (!userRes.ok) {
          throw new Error('Unable to load your profile.');
        }

        const userData = await userRes.json();

        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profile/orders`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: 'no-store',
          },
        );

        if (!ordersRes.ok) {
          throw new Error('Unable to load your orders.');
        }

        const ordersData = await ordersRes.json();

        if (!cancelled) {
          setFullName(userData.fullName || '');
          setPhone(userData.phone || '');
          setAddress(
            userData.address_line1 ||
              userData.shippingAddress ||
              userData.address ||
              '',
          );

          setOrders(ordersData.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUserAndOrders();

    return () => {
      cancelled = true;
    };
  }, [jwt]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            fullName,
            phone,
            address,
          }),
        },
      );

      if (!res.ok) {
        throw new Error('Unable to update your profile.');
      }

      const updatedUser = await res.json();

      login(updatedUser, jwt!);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !jwt) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <p className="text-[#79a875] font-medium">Loading your profile...</p>
      </main>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-[#243b2e]"
            >
              fresh<span className="text-[#79a875]">&</span>ready.
            </Link>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#79a875]">
              Customer dashboard
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#243b2e]">
              My account<span className="text-[#79a875]">.</span>
            </h1>

            <p className="mt-2 text-sm text-[#89938c]">
              Manage your details and keep track of your orders.
            </p>
          </div>

          <button
            onClick={logout}
            className="self-start sm:self-center rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            Log out →
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl bg-white border border-[#e9e8e1] p-6">
            <p className="text-sm text-[#89938c]">Total orders</p>
            <p className="mt-2 text-3xl font-extrabold text-[#243b2e]">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#e9e8e1] p-6">
            <p className="text-sm text-[#89938c]">Total spent</p>
            <p className="mt-2 text-3xl font-extrabold text-[#243b2e]">
              {formatPrice(totalSpent)}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#e9e8e1] p-6">
            <p className="text-sm text-[#89938c]">Account</p>
            <p className="mt-2 text-2xl font-extrabold text-[#79a875]">
              Active
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <section className="lg:col-span-1">
            <div className="rounded-3xl bg-white border border-[#e9e8e1] p-6 sm:p-7 shadow-sm">
              <div className="mb-7">
                <span className="text-2xl">👤</span>

                <h2 className="mt-3 text-xl font-bold text-[#243b2e]">
                  Personal details
                </h2>

                <p className="mt-1 text-sm text-[#89938c]">
                  Keep your information up to date.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#243b2e]">
                    Full name
                  </label>

                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none focus:border-[#79a875] transition"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#243b2e]">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none focus:border-[#79a875] transition"
                    placeholder="+31 6 12345678"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#243b2e]">
                    Delivery address
                  </label>

                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none focus:border-[#79a875] transition resize-none"
                    placeholder="Street, house number, postal code, city"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="text-sm text-[#79a875] font-medium">
                    ✓ Your details have been updated!
                  </p>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full rounded-full bg-[#243b2e] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#344f3d] transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes →'}
                </button>
              </div>
            </div>
          </section>

          {/* Order History */}
          <section className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#243b2e]">
                  Order history
                </h2>

                <p className="mt-1 text-sm text-[#89938c]">
                  Your recent purchases.
                </p>
              </div>

              <span className="rounded-full bg-[#eaf1e6] px-4 py-2 text-xs font-semibold text-[#537b53]">
                {orders.length} orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-3xl border border-[#e9e8e1] bg-white p-10 text-center">
                <span className="text-4xl">🛍️</span>

                <h3 className="mt-4 text-lg font-bold text-[#243b2e]">
                  No orders yet
                </h3>

                <p className="mt-2 text-sm text-[#89938c]">
                  Your fresh food orders will appear here.
                </p>

                <Link
                  href="/products"
                  className="inline-block mt-6 rounded-full bg-[#243b2e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#344f3d] transition"
                >
                  Explore products →
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-[#e9e8e1] bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3 border-b border-[#eeeee8] pb-4">
                      <div>
                        <p className="text-xs text-[#89938c]">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-[#243b2e]">
                          Order #{order.id}
                        </h3>
                      </div>

                      <span className="rounded-full bg-[#eaf1e6] px-3 py-1.5 text-xs font-semibold text-[#537b53]">
                        {order.stare || 'Processing'}
                      </span>
                    </div>

                    <div className="py-4 space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center gap-4 text-sm"
                        >
                          <div>
                            <p className="font-semibold text-[#243b2e]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-[#89938c]">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-medium text-[#243b2e] whitespace-nowrap">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#eeeee8] pt-4 flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#89938c]">
                        Order total
                      </span>

                      <span className="text-lg font-extrabold text-[#243b2e]">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#79a875] hover:text-[#243b2e] transition"
          >
            ← Back to Fresh&Ready
          </Link>
        </div>
      </div>
    </main>
  );
}
