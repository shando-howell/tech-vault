import Image from 'next/image';
import Link from 'next/link';

// Define the shape of the product data
interface Product {
  id: number;
  name: string;
  price: string | number;
  image_url: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getProducts() {
  try {
    const response = await fetch(`${apiUrl}/api/products/latest`, {
      cache: 'no-store'
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.products as Product[];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  console.log(products);

  return (
    <main className="min-h-screen bg-black">
      {/* HERO SECTION */}
      <section className="bg-gray-50 border-b border-gray-200 py-30 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-tech-background mb-6">
            Next-Gen Ecommerce
          </h1>
          <div className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            <p>
              A digital platform built with Next.js, Node.js and PostgreSQL.
            </p>
            <p>
              Engineered for performance and security.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-400
              transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Inventory Grid */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-8">Latest In Stock</h2>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-600">No products found. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                href={`/product/${product.id}`}
                key={product.id}
                className="group cursor-pointer"
              >

                {/* Product Image Box */}
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden
                mb-4 border border-gray-200">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-200 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <span className="font-bold text-gray-200">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}