// app/success/page.tsx
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Plată reușită!</h1>
        <p className="text-gray-700 mb-6">
          Îți mulțumim pentru comandă! Vei primi un email de confirmare cu detaliile plății.
        </p>
        <Link
          href="/products"
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Înapoi la produse
        </Link>
      </div>
    </div>
  );
}
