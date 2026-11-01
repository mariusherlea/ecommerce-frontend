//app/products/[slug]/ProductDetails.tsx

'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: any;
  price: number;
  inStock: string;
  image?: {
    url?: string;
    formats?: {
      large?: { url?: string };
      medium?: { url?: string };
    };
    data?: {
      url?: string;
      attributes?: {
        url?: string;
      };
    } | null;
  } | null;
};

function getImageUrl(image: Product['image']): string | null {
  if (!image) return null;

  const media = image.data ?? image;
  const attributes = 'attributes' in media ? media.attributes : undefined;

  const url =
    attributes?.url ||
    ('formats' in media ? media.formats?.large?.url : undefined) ||
    ('formats' in media ? media.formats?.medium?.url : undefined) ||
    ('url' in media ? media.url : undefined);

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
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full max-h-[420px] object-cover rounded-xl mb-6"
        />
      ) : (
        <div className="w-full h-64 bg-gray-900 rounded-xl mb-6 flex items-center justify-center text-gray-500">
          No image available
        </div>
      )}

      <h1 className="text-3xl font-bold">{product.title}</h1>

      <p className="text-gray-400 mt-4">{formatPrice(product.price)}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Description</h2>

        <p className="text-gray-300 whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>

      <p className="mt-6">În stoc: {product.inStock}</p>

      <button
        onClick={() =>
          addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
          })
        }
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Add to cart
      </button>
    </div>
  );
}
