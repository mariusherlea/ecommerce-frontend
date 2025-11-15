//app/layouy.
import "./globals.css";

import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "../components/NavBar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="p-6">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}