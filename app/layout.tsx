import { ReactNode } from "react";
import "./globals.css";

import { CartProvider } from "../context/CartContext";
import Navbar from "../components/NavBar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <CartProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}