'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Dacă user nu e logat → redirect
  useEffect(() => {
    if (!jwt) router.push('/login');
  }, [jwt, router]);

  // Precompletare formular + încărcare comenzi
  useEffect(() => {
    if (!jwt) return;

    const fetchUserAndOrders = async () => {
      try {
        // Preluăm utilizatorul
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          },
        );

        if (!userRes.ok) throw new Error('Eroare la preluarea utilizatorului');
        const userData = await userRes.json();

        // Update local & AuthContext
        setFullName(userData.fullName || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');

        login(userData, jwt); // ✔ menține Auth sincronizat

        // Preluăm comenzile userului
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders?populate=items&filters[email][$eq]=${userData.email}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          },
        );

        if (!ordersRes.ok) throw new Error('Eroare la preluarea comenzilor');

        const ordersData = await ordersRes.json();
        setOrders(ordersData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [jwt, login]);

  // 🟢 Salvare date în Strapi
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
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

      if (!res.ok) throw new Error('Eroare la actualizarea datelor');

      const updatedUser = await res.json();

      // actualizezi contextul
      login(updatedUser, jwt);

      alert('✔ Date actualizate cu succes!');
    } catch (err: any) {
      alert('❌ Eroare la actualizare');
    }
  };

  if (!user) return null;
  if (loading) return <p className="p-6">Data is loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👤 Your profile</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* 🟢 Formul DATE PERSONALE */}
      <div className="bg-black shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">📄 Personal data</h2>

        <div className="space-y-2">
          <label>Full name</label>
          <input
            className="w-full border p-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label>Phone</label>
          <input
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label>Delivery address</label>
          <input
            className="w-full border p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
        >
          Save changes
        </button>
      </div>

      {/* 🟢 Istoric comenzi */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🧾 Order history</h2>

        {orders.length === 0 ? (
          <p>No order yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 bg-black shadow"
              >
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <h3 className="font-semibold">Comanda #{order.id}</h3>
                <p>Total: {formatPrice(order.total)}</p>
                <p>Status: {order.stare}</p>

                <ul className="mt-2 text-sm">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} — {item.quantity} × {formatPrice(item.price)}
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
