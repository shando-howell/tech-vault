'use client';

import { useState } from 'react';
import { useAuth } from "@clerk/nextjs";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ImageUploadProps {
    productId: string;
    onUpload?: (url: string) => void;
}

export default function ImageUpload({ productId, onUpload }: ImageUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Used to grab the active session token
    const { getToken } = useAuth();

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setStatus('idle');

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('productId', productId);

            // Fetch the raw JWT token from Clerk
            const token = await getToken();
            console.log("CLERK TOKEN:", token);

            const response = await fetch(`${apiUrl}/api/upload`, {
                method: 'POST',
                headers: {
                    // Pass the token to the Express middleware
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed.');

            const data = await response.json();
            const imageUrl = data.url;

            if (imageUrl && onUpload) {
                onUpload(imageUrl);
            }

            setStatus('success');
            setFile(null);
        } catch (error) {
            console.error('Frontend upload error:', error);
            setStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-tech-surface border border-tech-border p-6 rounded-2xl max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Product Image</h3>

            <div className="flex flex-col gap-4">
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                    file:text-sm file:font-semibold file:bg-tech-background file:text-tech-accent hover:file:bg-gray-800
                    transition-all cursor-pointer"
                />

                <button 
                    onClick={handleUpload} 
                    disabled={!file || isUploading}
                    className="bg-tech-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Uploading image' : 'Upload File'}
                </button>

                {status === 'success' && (
                    <p className="text-green-400 text-sm font-mono mt-2">Image uploaded successfully.</p>
                )}
                {status === 'error' && (
                    <p className="text-red-400 text-sm font-mono mt-2">Upload failed.</p>
                )}
            </div>
        </div>
    );
}