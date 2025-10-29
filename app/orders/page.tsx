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
        console.log("🔗 Fetching orders from:", url);

        // trimitem tokenul public
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        console.log("🔑 Token trimis:", token);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError(`Eroare la preluarea comenzilor: ${res.status}`);
          throw new Error(`Eroare la preluarea comenzilor: ${res.status}`);
        }

        const data = await res.json();
        console.log("📦 Comenzi din Strapi:", data);
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
        <p className="mt-4 text-sm text-gray-600">
          Verifică consola pentru detalii suplimentare.
        </p>
      </div>
    );

  if (orders.length === 0)
    return <p className="p-6">Nu există comenzi înregistrate.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧾 Comenzile tale</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <h2 className="text-lg font-semibold">Comanda #{order.id}</h2>
            <p className="text-gray-600">Total: {order.total} lei</p>
            <p
              className={`mt-2 font-semibold ${
                order.stare === "paid"
                  ? "text-green-600"
                  : order.stare === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Status: {order.stare}
            </p>
          </div>
        ))}
      </div>

      {/* 🧩 Detalii comanda (modal) */}
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

            <p className="mb-2 text-gray-600">
              Email: {selectedOrder.email || "nespecificat"}
            </p>

            <p className="mb-4 font-semibold">
              Total: {selectedOrder.total} lei
            </p>

            <div>
              <h3 className="font-semibold mb-2">Produse:</h3>
              <ul className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between border-b pb-2 text-sm"
                  >
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} × {item.price} lei
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
