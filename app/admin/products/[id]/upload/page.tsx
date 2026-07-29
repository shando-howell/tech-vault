"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProductImageUploadPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleImageUploaded = async (cloudinaryUrl: string) => {
        setIsSaving(true);

        console.log("THE ID IS:", productId, "TYPE:", typeof productId);

        try {
            // Send the Cloudinary URL back to Express to update the product
            const response = await fetch(`${apiUrl}/api/admin/products/${productId}/image`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: cloudinaryUrl }),
            });

            const data = await response.json();

            if (data.success) {
                // Flow complete, return to the inventory table.
                router.push('/admin/products');
                router.refresh();
            } else {
                setError("Failed to link image to product.")
            }
        } catch (error) {
            console.error(error);
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto text-center mt-12">
            <h1 className="text-3xl font-bold mb-2">Upload Product Image</h1>
            <p className="text-gray-500 mb-8">
                Your product details are saved. Now attach an image.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="p-8 rounded-lg shadow-sm">
                {isSaving ? (
                    <div className="animate-pulse text-gray-600 font-medium">
                        Linking image to database...
                    </div>
                ) : (
                    <ImageUpload 
                        productId={productId as string}
                        onUpload={handleImageUploaded}
                    />
                )}
            </div>

            {/* Escape hatch */}
            <button
                onClick={() => router.push('/admin/products')}
                className="mt-6 text-sm text-gray-300 hover:text-gray-200 transition-colors"
            >
                Skip this step
            </button>
        </div>
    )
}