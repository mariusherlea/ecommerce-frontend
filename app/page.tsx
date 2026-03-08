export default function HomePage() {
  return (
    <main className="p-10 bg-yellow-500 text-green-600 text-3xl font-bold">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p className="mt-4">
        Visit{' '}
        <a href="/products" className="text-blue-600 underline">
          items
        </a>
        .
      </p>
    </main>
  );
}
