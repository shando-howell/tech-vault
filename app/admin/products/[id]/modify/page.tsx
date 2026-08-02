"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DeleteProductButton from '@/components/DeleteButton';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });

    // Fetch the existing product data when the page loads
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/products/${productId}`);
                const data = await response.json();

                if (data.success) {
                    setFormData({
                        name: data.product.name,
                        description: data.product.description,
                        price: data.product.price,
                    });
                } else {
                    setError("Failed to load product details.");
                }
            } catch (error) {
                console.error(error);
                setError("Network error occurred.")
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            void fetchProduct();
        }
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(`${apiUrl}/api/admin/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                router.push('/admin/products');
                router.refresh();
            } else {
                setError("Failed to update product.");
            }
        } catch (error) {
            console.error(error);
            setError("Network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-gray-600 animate-pulse">
                Loading product data...
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-4 mb-8">
                <Link 
                    href="/admin/products"
                    className="text-gray-200 hover:text-emerald-600 transition-colors"
                >
                    &larr; Back
                </Link>
                <h1 className="text-3xl font-bold">Modify Product Listing</h1>
            </div>

            <form 
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6"
            >
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Product Name</label>
                    <input
                        type="text"
                        required
                        className="w-full border text-gray-900 border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-black focus:outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full border text-gray-900 border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-black focus:outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Price (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="w-full border text-gray-900 border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-black focus:outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-emerald-600 text-white font-medium py-3 px-6 rounded-md hover:bg-emerald-500
                        transition-colors disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Update'}
                    </button>
                    
                    <DeleteProductButton productId={Number(productId)}/>
                </div>
            </form>
        </div>
    );
}