"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  stripeSessionId: string;
  email: string | null;
  total: number;
  stare: string;
  items: {
    name: string;
    quantity: number | null;
    price: number;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
          }
        );
        const data = await res.json();
        setOrders(data.data);
      } catch (err) {
        console.error("❌ Eroare la preluarea comenzilor:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p>Se încarcă comenzile...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Comenzile mele</h1>

      {orders.length === 0 ? (
        <p>Nu există comenzi înregistrate.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-lg p-4 shadow-sm">
              <p>
                <strong>ID comandă:</strong> {order.id}
              </p>
              <p>
                <strong>Email:</strong> {order.email ?? "necunoscut"}
              </p>
              <p>
                <strong>Total:</strong> {order.total} RON
              </p>
              <p>
                <strong>Stare:</strong> {order.stare}
              </p>
              <div className="mt-3">
                <strong>Produse:</strong>
                <ul className="list-disc list-inside">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} - {item.quantity} x {item.price} RON
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
