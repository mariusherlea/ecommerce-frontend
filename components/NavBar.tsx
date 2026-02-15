//components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="flex justify-between p-4 shadow bg-red-500">
      <Link href="/">Home</Link>

      <div className="flex items-center gap-4">
        {/* 🛒 Cart Badge */}
        <Link href="/cart" className="relative">
          Coș
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-yellow-600 text-xs px-2 py-1 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>

        {/* 👤 User Login / Profile */}
        {user ? (
          <>
            <Link href="/profile" className="font-semibold">
              {user.username}
            </Link>
            <button
              onClick={logout}
              className="bg-red-400 text-green-600 px-3 py-1 rounded"
            >
              Delogare
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 text-green-600 px-3 py-1 rounded"
          >
            Autentificare
          </Link>
        )}
      </div>
    </nav>
  );
}
