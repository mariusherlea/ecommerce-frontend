"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 6,
    pageCount: 1,
    total: 0,
  });

  // fetch produse din Strapi cu search + paginare
  async function fetchProducts(query: string = "", page: number = 1) {
    setLoading(true);
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`
      );

      // search
      if (query) {
        url.searchParams.append("filters[title][$containsi]", query);
      }

      // pagination
      url.searchParams.append("pagination[page]", page.toString());
      url.searchParams.append("pagination[pageSize]", "6");

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();

      setProducts(data.data);
      setPagination(data.meta.pagination);
    } catch (error) {
      console.error("Eroare la fetch produse:", error);
    } finally {
      setLoading(false);
    }
  }

  // inițial → prima pagină
  useEffect(() => {
    fetchProducts("", 1);
  }, []);

  // când tastezi → reset la pagina 1
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(search, 1);
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  // schimbă pagina
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pageCount) return;
    fetchProducts(search, newPage);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Produse</h1>

      {/* search box */}
      <input
        type="text"
        placeholder="Caută produse..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      {loading && <p className="text-gray-500">Se încarcă...</p>}

      {products.length === 0 && !loading ? (
        <p className="text-gray-500">Niciun produs găsit.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-600">{product.price} lei</p>
              <Link
                href={`/products/${product.slug}`}
                className="text-blue-600 hover:underline block mt-2"
              >
                Vezi detalii →
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* butoane paginare */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => changePage(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Înapoi
        </button>

        <span>
          Pagina {pagination.page} din {pagination.pageCount}
        </span>

        <button
          onClick={() => changePage(pagination.page + 1)}
          disabled={pagination.page === pagination.pageCount}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Înainte →
        </button>
      </div>
    </div>
  );
}
