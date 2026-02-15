//app/products/[slug]/page.tsx
import ProductDetails from './ProductDetails';

type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: any;
  price: number;
  inStock: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

async function getProduct(slug: string): Promise<Product | null> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error('NEXT_PUBLIC_STRAPI_URL is missing');

  const qs = new URLSearchParams({
    'filters[slug][$eq]': slug,
    populate: '*',
  });

  const url = `${base}/api/products?${qs.toString()}`;
  console.log('Fetching:', url);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.log('Strapi status:', res.status);
      return null;
    }

    const data = await res.json();
    return data?.data?.length ? data.data[0] : null;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err; // ca să vezi cauza reală în terminal
  }
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params; // 👈 Next.js 15 requirement

  const product = await getProduct(slug);
  if (!product) return <p className="p-6">Produsul nu a fost găsit.</p>;
  return <ProductDetails product={product} />;
}
