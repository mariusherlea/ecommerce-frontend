//app/products/[slug]/ProductDetails.tsx

'use client';

'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';

type ProductImage = {
  url?: string;
  formats?: {
    large?: { url?: string };
    medium?: { url?: string };
    small?: { url?: string };
    thumbnail?: { url?: string };
  };
};

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: any;
  price: number;
  inStock: string;
  images?: ProductImage[] | null;
};

function getImageUrl(images?: ProductImage[] | null): string | null {
  if (!images || images.length === 0) return null;

  const image = images[0];

  const url =
    image.formats?.large?.url || image.formats?.medium?.url || image.url;

  if (!url) return null;

  return url.startsWith('http')
    ? url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

function renderDescription(description: any): string {
  if (!description) return 'No description available.';

  if (typeof description === 'string') return description;

  if (Array.isArray(description)) {
    return description
      .map((block) => {
        if (block.children) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  }

  return 'No description available.';
}

export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const description = renderDescription(product.description);
  const imageUrl = getImageUrl(product.images);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#253b2d]">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-sm text-[#858b81]">
          <Link href="/" className="transition hover:text-[#78a66a]">
            Home
          </Link>

          <span>/</span>

          <Link href="/products" className="transition hover:text-[#78a66a]">
            Shop
          </Link>

          <span>/</span>

          <span className="font-medium text-[#253b2d]">{product.title}</span>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Product Image */}
          <div className="overflow-hidden rounded-3xl border border-[#e9e9df] bg-white shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="aspect-square w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-[#edf1e9] text-6xl">
                🥗
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="py-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#78a66a]">
              Fresh food, made easy
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {product.title}
              <span className="text-[#78a66a]">.</span>
            </h1>

            <p className="mt-6 text-3xl font-extrabold text-[#253b2d]">
              {formatPrice(product.price)}
            </p>

            <div className="my-8 h-px bg-[#e9e9df]" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold">About this product</h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-[#777d73]">
                {description}
              </p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                })
              }
              className="mt-8 w-full rounded-full bg-[#253b2d] px-8 py-4 text-base font-semibold text-white shadow-sm transition duration-300 hover:bg-[#3e6047] active:scale-[0.98] sm:w-auto sm:min-w-[240px]"
            >
              Add to cart
            </button>

            {/* Additional Information */}
            <div className="mt-10 grid grid-cols-2 gap-5 border-t border-[#e9e9df] pt-7">
              <div>
                <p className="font-bold text-[#253b2d]">Fresh</p>
                <p className="mt-1 text-sm text-[#858b81]">
                  Quality ingredients
                </p>
              </div>

              <div>
                <p className="font-bold text-[#253b2d]">Easy</p>
                <p className="mt-1 text-sm text-[#858b81]">Simple ordering</p>
              </div>
            </div>

            <Link
              href="/products"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#78a66a] transition hover:text-[#527c50]"
            >
              ← Back to all products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
