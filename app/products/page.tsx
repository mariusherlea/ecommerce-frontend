//app/products/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/context/CartContext';

type ProductImage = {
  url?: string;
  formats?: {
    thumbnail?: { url?: string };
    small?: { url?: string };
  };
};

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description?: string | any[];
  images?: ProductImage[] | null;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

function getImageUrl(images?: ProductImage[] | null): string | null {
  if (!images || images.length === 0) return null;

  const image = images[0];

  const url =
    image.formats?.small?.url || image.formats?.thumbnail?.url || image.url;

  if (!url) return null;

  return url.startsWith('http')
    ? url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

function getDescriptionText(description?: string | any[]): string {
  if (!description) return '';

  if (typeof description === 'string') {
    return description;
  }

  const extract = (blocks: any[]): string =>
    blocks
      .map((block) => {
        if (typeof block === 'string') return block;
        if (block.text) return block.text;

        if (Array.isArray(block.children)) {
          return extract(block.children);
        }

        return '';
      })
      .filter(Boolean)
      .join(' ');

  return extract(description);
}

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 6,
    pageCount: 1,
    total: 0,
  });

  const fetchProducts = useCallback(
    async (query: string = '', page: number = 1) => {
      setLoading(true);

      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`,
        );

        url.searchParams.append('populate', '*');

        if (query) {
          url.searchParams.append('filters[title][$containsi]', query);
        }

        url.searchParams.append('pagination[page]', page.toString());

        url.searchParams.append('pagination[pageSize]', '6');

        const res = await fetch(url.toString(), {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await res.json();

        setProducts(data.data ?? []);
        setPagination(data.meta.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(search, 1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, fetchProducts]);

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pageCount) return;

    fetchProducts(search, newPage);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#253b2d]">
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Page Heading */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#78a66a]">
            Fresh food, made easy
          </p>

          <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                Our Products<span className="text-[#78a66a]">.</span>
              </h1>

              <p className="mt-3 text-base text-[#777d73]">
                Discover delicious meals and fresh choices for every day.
              </p>
            </div>

            <p className="text-sm text-[#858b81]">
              {pagination.total} products available
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <svg
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#858b81]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 4 4" />
          </svg>

          <input
            type="text"
            placeholder="Search for your favorite food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
            className="w-full rounded-full border border-[#e5e7df] bg-white py-4 pl-14 pr-6 text-sm text-[#253b2d] outline-none transition placeholder:text-[#a0a49b] focus:border-[#78a66a] focus:ring-4 focus:ring-[#78a66a]/10"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7df] border-t-[#78a66a]" />
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl border border-[#e9e9df] bg-white px-6 py-20 text-center">
            <div className="text-5xl">🥗</div>

            <h2 className="mt-5 text-2xl font-bold">No products found</h2>

            <p className="mt-3 text-sm text-[#858b81]">
              Try another search term or explore our products.
            </p>

            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-6 rounded-full bg-[#253b2d] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#3e6047]"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const imageUrl = getImageUrl(product.images);
              const description = getDescriptionText(product.description);

              return (
                <li
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-[#e9e9df] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block overflow-hidden bg-[#f1f1eb]"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center text-[#858b81]">
                        <span className="text-4xl">🥗</span>
                      </div>
                    )}
                  </Link>

                  {/* Product Information */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-[#253b2d] transition group-hover:text-[#78a66a]">
                      {product.title}
                    </h2>

                    {description && (
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#858b81]">
                        {description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-xl font-extrabold text-[#253b2d]">
                        {formatPrice(product.price)}
                      </p>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-semibold text-[#78a66a] transition hover:text-[#527c50]"
                      >
                        View details →
                      </Link>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                        })
                      }
                      className="mt-5 w-full rounded-full bg-[#253b2d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3e6047] active:scale-[0.98]"
                    >
                      Add to cart
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#e9e9df] pt-8">
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-full border border-[#d9ded4] px-6 py-3 text-sm font-semibold text-[#253b2d] transition hover:bg-[#edf1e9] disabled:cursor-not-allowed disabled:opacity-35"
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-[#777d73]">
              Page {pagination.page} of {pagination.pageCount}
            </span>

            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.pageCount}
              className="rounded-full bg-[#253b2d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3e6047] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
