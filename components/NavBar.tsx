"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const router = useRouter();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const [open, setOpen] = useState(false);

   useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };


  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* 🔹 Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🛍️ MyShop
        </Link>

        {/* 🔹 Links */}
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-gray-700 hover:text-blue-600">
            Produse
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-blue-600">
            Coș
          </Link>

          {user ? (
            <>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-blue-600"
              >
                👤 {user.username || "Profil"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Deconectare
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Autentificare
            </Link>
          )}
        </div>
      </div>
    </nav>
  );

}
