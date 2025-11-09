"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🔁 funcție comună de citire user din localStorage
  const loadUserFromLocalStorage = () => {
    try {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      localStorage.removeItem("user");
    } finally {
      setIsLoadingUser(false);
    }
  };

  // ✅ citim userul la montare
  useEffect(() => {
    loadUserFromLocalStorage();

    // 🔔 ascultăm evenimentul custom (declanșat în login)
    const handleUserLogin = () => loadUserFromLocalStorage();

    // 🔄 ascultăm modificările localeStorage din alte tab-uri
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "jwt") {
        loadUserFromLocalStorage();
      }
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
     // 👇 forțează sincronizarea și în alte tab-uri
    window.dispatchEvent(new StorageEvent("storage", { key: "user" }));
    router.push("/");
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🛒 MyShop
        </Link>

        <div className="flex items-center gap-6 min-w-[200px] justify-end">
          {isLoadingUser ? (
            <div className="flex gap-4">
              <div className="w-20 h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-5 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : (
            <>
              <Link href="/products" className="text-gray-700 hover:text-blue-600">
                Produse
              </Link>

              {/* 🛍️ Coș cu număr */}
              <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
                Coș
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    👤 {user.username || "Profil"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Deconectare
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Autentificare
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
