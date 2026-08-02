import ProductImage from '@/components/ProductImage';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function ProductPage({ params }: { params: Promise<{id: string }> }) {
    const { id } = await params;

    // Fetch the live data from the API
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
        cache: 'no-store'
    });

    const data = await response.json();

    if (!data.success || !data.product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-tech-background">
                <h1 className="text-3xl font-bold text-gray-200 mb-4">Product Not Found</h1>
                <Link href="/products" className="text-emerald-600 hover:underline">
                    &larr; Back to all products
                </Link>
            </div>
        )
    }

    const product = data.product;

    return (
        <div className="min-h-screen bg-tech-background text-white p-8">
            {/* Breadcrumb navigation */}
            <nav className="text-sm mb-8 px-20">
                <Link href="/products" className="text-gray-200 hover:text-emerald-600 transition-colors">
                    Products
                </Link>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-200 font-medium">{product.name}</span>
            </nav>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Massive Product Render */}
                <div className="lg:col-span-2 bg-tech-surface border border-tech-border rounded-3xl p-10
                flex items-center justify-center">
                    <ProductImage productId={product.id} />
                </div>

                {/* Checkout Card */}
                <div className="bg-tech-surface border border-tech-border rounded-3xl p-8 flex flex-col justify-between">
                    <div className="py-12">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
                        {/* <p className="text-gray-400 mb-6">{product.description}</p> */}
                        <div className="text-4xl font-semibold mb-8">${product.price}</div>

                        <AddToCartButton product={product} />
                    </div>
                </div>

                {/* Bottom Section: Bento Box Tech Specs */}
                <div className="bg-tech-surface border border-tech-border rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {product.stock_quantity} units in stock.
                        </h1>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-tech-surface border border-tech-border rounded-3xl p-10
                flex items-center justify-center">
                    {product.description}
                </div>
            </div>
        </div>
    );
}