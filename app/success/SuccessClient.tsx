// app/success/SuccessClient.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';

type OrderItem = { name: string; quantity: number; price: number };
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

  // ✅ Clear cart only once
  useEffect(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    clearCart();
  }, [clearCart]);

  // ✅ Fetch order by session_id
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
        if (!res.ok) throw new Error(json?.error || 'Failed to load order');

        if (!cancelled) setOrder(json.order);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="text-3xl">✅</div>
          <div>
            <h1 className="text-2xl font-bold text-green-500">
              Plata a fost efectuată cu succes!
            </h1>
            <p className="text-gray-300 mt-1">
              Comanda ta a fost procesată și va fi livrată în curând.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 p-4">
          <p className="text-sm text-gray-400">Session</p>
          <p className="font-mono text-xs text-gray-300 break-all">
            {sessionId ?? '—'}
          </p>
        </div>

        <div className="mt-4">
          {loading && (
            <p className="text-gray-300">Se încarcă detaliile comenzii…</p>
          )}

          {!loading && error && (
            <p className="text-red-400">Nu am putut încărca comanda: {error}</p>
          )}

          {!loading && !error && order === null && (
            <p className="text-gray-300">
              Comanda a fost înregistrată. Dacă nu apare încă, reîncearcă peste
              câteva secunde.
            </p>
          )}

          {!loading && !error && order && (
            <div className="mt-4 rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-200 font-semibold">
                  Comanda #{order.id}
                </p>
                <span className="text-xs rounded-full px-3 py-1 bg-green-500/15 text-green-400 border border-green-500/20">
                  {order.stare ?? 'paid'}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {order.items?.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-gray-200"
                  >
                    <div className="min-w-0">
                      <p className="truncate">{it.name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {it.quantity}
                      </p>
                    </div>
                    <p className="ml-4 shrink-0">
                      {formatEUR((it.price ?? 0) * (it.quantity ?? 0))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-gray-300">Total</p>
                <p className="text-xl font-bold text-white">
                  {formatEUR(order.total)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/products"
            className="flex-1 text-center bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            🛍️ Continuă cumpărăturile
          </Link>
          <Link
            href="/"
            className="flex-1 text-center bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/15 transition"
          >
            Acasă
          </Link>
        </div>
      </div>
    </div>
  );
}
