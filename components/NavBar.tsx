'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e9df] bg-[#faf9f6]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-[#253b2d]"
        >
          fresh<span className="text-[#78a66a]">&</span>ready.
        </Link>

        <div className="hidden items-center gap-9 text-sm font-medium text-[#253b2d] md:flex">
          <Link href="/" className="hover:text-[#78a66a]">
            Home
          </Link>
          <Link href="/products" className="hover:text-[#78a66a]">
            Shop
          </Link>
        </div>

        <div className="flex items-center gap-5 text-sm font-medium">
          <Link
            href="/login"
            className="hidden text-[#253b2d] hover:text-[#78a66a] sm:block"
          >
            Login
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full bg-[#253b2d] px-5 py-2.5 text-white transition hover:bg-[#3e6047]"
          >
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#78a66a] px-1 text-[11px] font-bold text-white ring-2 ring-[#faf9f6]">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
