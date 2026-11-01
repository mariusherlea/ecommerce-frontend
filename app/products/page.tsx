//app/products/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/context/CartContext';

type ProductImage = {
  url?: string;
  formats?: {
    thumbnail?: { url?: string };
    small?: { url?: string };
  };
  data?: {
    url?: string;
    attributes?: {
      url?: string;
      formats?: {
        thumbnail?: { url?: string };
        small?: { url?: string };
      };
    };
  } | null;
};

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description?: string | any[];
  image?: ProductImage | null;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

function getImageUrl(image?: ProductImage | null): string | null {
  if (!image) return null;

  const media = image.data ?? image;
  const attributes = 'attributes' in media ? media.attributes : undefined;

  const url =
    attributes?.formats?.thumbnail?.url ||
    attributes?.formats?.small?.url ||
    attributes?.url ||
    ('formats' in media ? media.formats?.thumbnail?.url : undefined) ||
    ('formats' in media ? media.formats?.small?.url : undefined) ||
    ('url' in media ? media.url : undefined);

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

  async function fetchProducts(query: string = '', page: number = 1) {
    setLoading(true);

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products`);

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

      setProducts(data.data);
      setPagination(data.meta.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts('', 1);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(search, 1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pageCount) return;
    fetchProducts(search, newPage);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Items</h1>

      <input
        type="text"
        placeholder="Search item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6 bg-black text-white"
      />

      {loading && <p className="text-gray-500">Loading...</p>}

      {products.length === 0 && !loading ? (
        <p className="text-gray-500">No item found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = getImageUrl(product.image);
            const description = getDescriptionText(product.description);

            return (
              <li
                key={product.id}
                className="border border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-black"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-900 flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.title}</h2>

                  <p className="text-gray-400 mt-2">
                    {description
                      ? `${description.slice(0, 110)}${description.length > 110 ? '...' : ''}`
                      : 'No description available.'}
                  </p>

                  <p className="text-gray-400 font-semibold mt-3">
                    {formatPrice(product.price)}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-blue-500 hover:underline"
                    >
                      See details
                    </Link>

                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                        })
                      }
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => changePage(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
        >
          ← Back
        </button>

        <span>
          Page {pagination.page} din {pagination.pageCount}
        </span>

        <button
          onClick={() => changePage(pagination.page + 1)}
          disabled={pagination.page === pagination.pageCount}
          className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
        >
          Forward →
        </button>
      </div>
    </div>
  );
}
