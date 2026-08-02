'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. We have received your order and are getting it ready.
                </p>

                <div className="bg-gray-50 p-4 rounded mb-6 border">
                    <p className="text-sm text-gray-600 uppercase tracking-wide">Order Number</p>
                    <p className="text-lg font-mono font-bold text-gray-800">{orderNumber}</p>
                </div>

                <Link
                    href="/"
                    className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-400 transition-colors"
                >
                    Return to Store
                </Link>
            </div>
        </div>
    );
}