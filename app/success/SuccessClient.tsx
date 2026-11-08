'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  email: string | null;
  total: number;
  currency: string;
  stare: string | null;
  items: OrderItem[];
};

function formatEUR(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export default function SuccessClient() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  const sessionId = useMemo(
    () => searchParams.get('session_id'),
    [searchParams],
  );

  const clearedRef = useRef(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clearedRef.current) return;

    clearedRef.current = true;
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/order-by-session?session_id=${encodeURIComponent(sessionId)}`,
          { cache: 'no-store' },
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || 'Failed to load order');
        }

        if (!cancelled) setOrder(json.order);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 text-[#243b2e]">
      <div className="max-w-3xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf1e5]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-10 w-10 text-[#79a875]"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M5 12.5L10 17L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#79a875] mb-3">
            Fresh food, made easy
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Payment successful<span className="text-[#79a875]">.</span>
          </h1>

          <p className="mt-3 text-[#7c8980]">
            Thank you for your order! Your fresh choices are on their way.
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-[#e9e8e1] bg-white p-6 md:p-9 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeee8] pb-5">
            <div>
              <h2 className="text-xl font-bold">Order confirmation</h2>
              <p className="mt-1 text-sm text-[#89938c]">
                Your payment has been received.
              </p>
            </div>

            <span className="rounded-full bg-[#eaf3e8] px-4 py-2 text-sm font-semibold text-[#659562]">
              ✓ Payment confirmed
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-10 text-center text-[#89938c]">
              Loading your order details...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              Unable to load order: {error}
            </div>
          )}

          {/* No order yet */}
          {!loading && !error && !order && (
            <div className="py-8 text-center text-[#89938c]">
              Your order is being registered. Please refresh in a few seconds.
            </div>
          )}

          {/* Order details */}
          {!loading && !error && order && (
            <>
              <div className="flex items-center justify-between py-5">
                <span className="text-sm text-[#89938c]">Order number</span>

                <span className="font-bold">#{order.id}</span>
              </div>

              <div className="border-t border-[#eeeee8] pt-5">
                <h3 className="mb-4 font-bold">Your order</h3>

                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>

                        <p className="mt-1 text-sm text-[#89938c]">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold">
                        {formatEUR((item.price ?? 0) * (item.quantity ?? 0))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#eeeee8] pt-5 flex items-center justify-between">
                <span className="font-semibold">Total paid</span>

                <span className="text-2xl font-extrabold">
                  {formatEUR(order.total)}
                </span>
              </div>
            </>
          )}

          {/* Session ID */}
          <div className="mt-6 rounded-xl bg-[#faf9f6] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#89938c]">
              Payment reference
            </p>

            <p className="mt-2 break-all font-mono text-xs text-[#64746a]">
              {sessionId ?? '—'}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/products"
              className="rounded-full bg-[#243b2e] px-6 py-4 text-center font-semibold text-white transition hover:bg-[#344f3d]"
            >
              Continue shopping →
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#dfe3d9] px-6 py-4 text-center font-semibold text-[#243b2e] transition hover:bg-[#f4f5ef]"
            >
              Back to home
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-[#9aa39b]">
            Fresh food. Simple ordering. Secure checkout.
          </p>
        </div>
      </div>
    </main>
  );
}
