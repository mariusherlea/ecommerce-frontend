// app/page.tsx
import { getProducts } from "../lib/api";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produse</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <li key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">
              {product.title}
            </h2>
            <p className="text-gray-600">${product.price}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
