"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-green-400 shadow p-4 flex justify-between items-center relative">
      <Link href="/" className="text-xl font-bold">
        🛒 MyShop
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/products" className="hover:text-blue-600">
          Produse
        </Link>

        {/* Buton coș */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Link href="/cart" className="relative">
            Coș
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Dropdown preview */}
          {open && cart.length > 0 && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-50">
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-gray-500">
                        {item.quantity} x {item.price} lei
                      </p>
                    </div>
                    <p className="font-bold">
                      {item.price * item.quantity} lei
                    </p>
                  </li>
                ))}
              </ul>

              {/* Total general */}
              <div className="mt-3 text-right font-semibold border-t pt-2">
                Total: {totalPrice} lei
              </div>

              {/* Butoane */}
              <div className="mt-3 flex justify-between gap-2">
                <Link
                  href="/cart"
                  className="flex-1 text-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Vezi coșul
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 text-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Finalizare
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
