import SearchBar from '@/components/SearchBar';
import Image from 'next/image';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ProductData {
  id: number;
  name: string;
  price: string | number;
  image_url: string;
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

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Await params
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;

    // Extract the search query from the URL
    const searchQuery = typeof params.q === 'string' ? params.q : "";

    const data = await getProducts(currentPage, 10, searchQuery);
    const { products, pagination } = data;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Products</h1>

                <SearchBar placeholder="Search by name..." />

                <Link
                    href="/admin/products/new"
                    className="bg-blue-700 text-white p-2 rounded-lg font-medium 
                    hover:bg-blue-500 transition-colors"
                >
                    + Add New Product
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-800 text-sm">Image</th>
                            <th className="p-4 font-semibold text-gray-800 text-sm">Name</th>
                            <th className="p-4 font-semibold text-gray-800 text-sm">Price</th>
                            <th className="p-4 font-semibold text-gray-800 text-sm text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No products found.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="relative h-12 w-12 bg-gray-100 rounded overflow-hidden">
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4 text-gray-800">${Number(product.price).toFixed(2)}</td>
                                    <td className="p-4 text-right">
                                        <Link
                                            href={`/admin/products/${product.id}/modify`}
                                            className="bg-blue-600 border border-blue-400 p-2 text-white hover:bg-blue-500 font-medium text-sm transition-colors rounded-lg"
                                        >
                                            Modify
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* The Pagination Controls */}
            <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-200">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalItems} total items)
                </span>
            </div>

            <div className="flex space-x-2">
                {pagination.currentPage > 1 ? (
                    <Link
                        href={`/admin/products?page=${pagination.currentPage - 1}`}
                        className="px-4 py-2 border rounded hover:bg-gray-600"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="px-4 py-2 border rounded text-gray-400 cursor-not-allowed">
                        Previous
                    </span>
                )}

                {pagination.currentPage < pagination.totalPages ? (
                    <Link
                        href={`/admin/products?page=${pagination.currentPage + 1}`}
                        className="px-4 py-2 border rounded hover:bg-gray-600"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="px-4 py-2 border rounded text-gray-300 cursor-not-allowed">
                        Next
                    </span>
                )}
            </div>
        </div>
    )
}