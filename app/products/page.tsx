// app/products/page.tsx
import { getProducts } from "@/lib/api";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produse</h1>
      <ul className="grid grid-cols-2 gap-4">
        {products.map((product: any) => (
          <li key={product.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p>{product.price} lei</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
