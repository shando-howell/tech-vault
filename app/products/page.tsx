import Image from 'next/image';
import Link from 'next/link';

import SearchBar from '@/components/SearchBar';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ProductData {
  id: number;
  sku: string;
  name: string;
  price: string | number;
  image_url: string;
  stock_quantity: number;
}

interface PaginatedResponse {
  success: boolean;
  products: ProductData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

async function getProducts(page: number, limit: number = 6, searchQuery: string = ""): Promise<PaginatedResponse> {
  // Fetching from API, forcing it to render dynamically
  const res = await fetch(`${apiUrl}/api/products?page=${page}&limit=${limit}&q=${searchQuery}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch catalog fron API.');
  }

  return res.json();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Extract the search query from the URL
  const searchQuery = typeof params.q === 'string' ? params.q : "";

  // Fetch the specific page
  const fetchedData = await getProducts(currentPage, 6, searchQuery);
  const { products, pagination } = fetchedData;

  return (
    <main className="min-h-screen">
      {/* PAGE HEADER */}
      <div className="p-8 font-sans">
        <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shop Devices</h1>
            <p className="text-lg text-gray-200 mb-10">
              Browse our complete collection of premium gadgets.
            </p>
          </div>

          <SearchBar placeholder="Search by name..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
            <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="block bg-tech-surface border border-tech-border rounded-3xl p-6 
                hover:border-emerald-500 hover:shadow-[0_0_10px_rgba(80,200,120,1)] transition-all"
            >
              <div className="relative aspect-4/5 bg-gray-100 rounded-lg overflow-hidden mb-4 
              border border-gray-200">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-sm text-gray-400">
                    Coming Soon
                  </div>
                )}
              </div>
                <div className="border p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-400 mb-2">{product.sku}</p>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-lg text-green-600 font-medium">
                    ${product.price}
                    </span>
                    <span className="text-sm bg-tech-background px-2 py-1 rounded">
                    Stock: {product.stock_quantity}
                    </span>
                </div>
                </div>
            </Link>
            ))}
        </div>

        {/* The Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          {/* Previous Button */}
          {pagination.currentPage > 1 ? (
            <Link 
              href={`/products?page=${pagination.currentPage - 1}`}
              className="px-4 py-2 border rounded-md hover:bg-black"
            >
              Previous
            </Link>
          ) : (
            <span className="px-4 py-2 border rounded-md text-gray-200 cursor-not-allowed">
              Previous
            </span>
          )}

          {/* Page Indicator */}
          <span className="text-gray-200 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          {/* Next Button */}
          {pagination.currentPage < pagination.totalPages ? (
            <Link
              href={`/products?page=${pagination.currentPage + 1}`}
              className="px-4 py-2 border rounded-md hover:bg-tech-background"
            >
              Next
            </Link>
          ) : (
            <span className="px-4 py-2 border rounded-md text-gray-200 cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      </div>
    </main>
  );
}