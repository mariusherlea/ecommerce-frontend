//app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  email: string;
};

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
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUserAndOrders() {
      try {
        // 🧠 Preluăm datele utilizatorului
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!userRes.ok) throw new Error("Eroare la preluarea datelor utilizatorului");
        const userData = await userRes.json();
        setUser(userData);

        // 📦 Preluăm comenzile sale
        const ordersRes = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders?populate=items&filters[email][$eq]=${userData.email}`,
  {
    headers: { Authorization: `Bearer ${token}` }, // 👈 JWT, nu STRAPI_API_TOKEN
  }
);

        if (!ordersRes.ok) throw new Error("Eroare la preluarea comenzilor");
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndOrders();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return <p className="p-6">Se încarcă datele...</p>;

  if (error)
    return (
      <div className="p-6 text-red-600">
        <p>⚠️ {error}</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👤 Profilul tău</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Deconectare
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p><strong>Nume utilizator:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">🧾 Istoric comenzi</h2>
        {orders.length === 0 ? (
          <p>Nu ai nicio comandă momentan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
              >
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <h3 className="font-semibold">Comanda #{order.id}</h3>
                <p>Total: {order.total} lei</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.stare === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.stare}
                  </span>
                </p>

                <ul className="mt-2 text-sm text-gray-700">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} — {item.quantity} × {item.price} lei
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
