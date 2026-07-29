"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ProductImageProps {
    productId: string;
}

export default function ProductImage({ productId }: ProductImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                // Fetch from the API
                const response = await fetch(`${apiUrl}/api/products/${productId}/images`);
                const data = await response.json();

                if (data.success && data.imageUrl) {
                    setImageUrl(data.imageUrl);
                }
            } catch (error) {
                console.error("Failed to load images.", error);
            }
        };

        if (productId) {
            fetchImage();
        } else {
            console.log("FETCH SKIPPED: productId is undefined or 0");
        }
    }, [productId]);

    if (!imageUrl) return <p>No images uploaded yet.</p>;

    return (
        <div className="relative aspect-square h-80 w-200 rounded-lg overflow-hidden">
            <Image
                src={imageUrl}
                alt="Product Image"
                fill
                className="object-cover rounded-lg"
                unoptimized
            />  
        </div>
    );
}