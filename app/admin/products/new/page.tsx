"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        stock_quantity: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(`${apiUrl}/api/admin/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            const id = data.product.id;

            if (data.success) {
                router.push(`/admin/products/${id}/upload`);
                router.refresh();
            } else {
                setError("Failed to create product. Check server logs.")
            }
        } catch (error) {
            console.error(error);
            setError("Network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-4 mb-8">
                <Link href="/admin/products" className="text-gray-300 hover:text-emerald-600 transition-colors">
                    &larr; Back
                </Link>
                <h1 className="text-3xl font-bold">Add New Product</h1>
            </div>

            <div>
                <form 
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 mb-6"
                >
                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border text-gray-900 border-gray-300 rounded-md p-2 focus:ring-2
                            focus:ring-black focus:outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g., Premium Wireless Headphones"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">SKU</label>
                        <input
                            type="text"
                            required
                            className="w-full border text-gray-900 border-gray-300 rounded-md p-2 focus:ring-2
                            focus:ring-black focus:outline-none"
                            value={formData.sku}
                            onChange={(e) => setFormData({...formData, sku: e.target.value})}
                            placeholder="e.g., 0317-8471"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full border text-gray-900 border-gray-300 rounded-md p-2 focus:ring-2
                            focus:ring-black focus:outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Price (USD)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            className="w-full border text-gray-900 border-gray-300 rounded-md p-2 focus:ring-2
                            focus:ring-black focus:outline-none"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="199.99"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">In Stock</label>
                        <input
                            type="number"
                            min="5"
                            required
                            className="w-full border text-gray-900 border-gray-300 rounded-md p-2 focus:ring-2
                            focus:ring-black focus:outline-none"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                            placeholder="10"
                        />
                    </div> 

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white font-medium py-3 rounded-md
                        hover:bg-emerald-500  transition-colors disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Creating..' : 'Continue to Image Upload'}
                    </button>
                </form>
            </div>
        </div>
    );
}