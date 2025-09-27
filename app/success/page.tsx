export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        ✅ Plata a fost procesată cu succes!
      </h1>
      <p className="text-gray-700 mb-6">
        Comanda ta a fost înregistrată și va fi procesată în curând.
      </p>
      <a
        href="/orders"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Vezi comenzile mele
      </a>
    </div>
  );
}
