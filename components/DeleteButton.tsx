'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function DeleteProductButton({ productId }: { productId: number | string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        setIsDeleting(true);
    
        try {
            const response = await fetch(`${apiUrl}/api/admin/products/${productId}`, {
                method: 'DELETE',
            });
                
            if (!response.ok) throw new Error('Failed to delete product.');

            // Clear the cache of the old data
            router.refresh();

            // Send the user back to the admin table
            router.push('/admin/products');
        } catch (error) {
            console.error("Failed to delete product.", error);
            alert("Something went wrong while deleting.");
            setIsDeleting(false); // Reset button state if delete 
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 
            disabled:opacity-50 transition-colors"
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    )
}