"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  documentId: string;
  email: string;
  total: number;
  stare: string;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  items: OrderItem[];
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders?populate=items`;
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError(`Eroare la preluarea comenzilor: ${res.status}`);
          throw new Error(`Eroare la preluarea comenzilor: ${res.status}`);
        }

        const data = await res.json();
        setOrders(data.data || []);
      } catch (err: any) {
        console.error("❌ Eroare fetchOrders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Se încarcă comenzile...</p>;

  if (error)
    return (
      <div className="p-6 text-red-600">
        <p>⚠️ A apărut o eroare:</p>
        <p className="mt-2 font-mono">{error}</p>
      </div>
    );

  if (orders.length === 0)
    return <p className="p-6">Nu există comenzi înregistrate.</p>;

  const StatusBadge = ({ status }: { status: string }) => {
    const colorMap: Record<string, string> = {
      paid: "bg-green-100 text-green-700 border-green-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      failed: "bg-red-100 text-red-700 border-red-300",
    };
    const color = colorMap[status] || "bg-gray-100 text-gray-700 border-gray-300";

    return (
      <span
        className={`px-3 py-1 text-sm font-semibold border rounded-full ${color}`}
      >
        {status === "paid"
          ? "✅ Paid"
          : status === "pending"
          ? "⌛ Pending"
          : status === "failed"
          ? "❌ Failed"
          : status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧾 Comenzile tale</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="border p-5 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition bg-white"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Comanda #{order.id}</h2>
              <StatusBadge status={order.stare} />
            </div>

            <p className="text-sm text-gray-500 mb-1">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-600 font-medium">
              Total: <span className="font-semibold">{order.total} lei</span>
            </p>
          </div>
        ))}
      </div>

      {/* 🔍 Modal detalii comandă extins */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Detalii Comandă #{selectedOrder.id}
            </h2>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p>
                <strong>Email client:</strong>{" "}
                {selectedOrder.email || "nespecificat"}
              </p>
              <p>
                <strong>Data comenzii:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong> <StatusBadge status={selectedOrder.stare} />
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-800 border-b pb-1">
                Produse comandate
              </h3>
              <ul className="divide-y divide-gray-200">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-gray-600">
                      {item.quantity} × {item.price} lei ={" "}
                      <strong>{item.quantity * item.price} lei</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border-t pt-3 text-right font-semibold text-gray-800">
              Total: {selectedOrder.total} lei
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
