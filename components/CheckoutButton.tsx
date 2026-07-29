'use client';

import { useAuth } from '@clerk/nextjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutButton({ productId }: { productId: string }) {
    const { getToken } = useAuth();

    const handleCheckout = async () => {
        // Grab the active session JWT from Clerk
        const token = await getToken();

        const response = await fetch(`${apiUrl}/api/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId })
        });

        const data = await response.json();
        console.log('Checkout response:', data);
    };

    return (
        <button
            onClick={handleCheckout}
            className="w-full bg-tech-accent text-white py-4 rounded-xl font-medium hover:bg-blue-500
            transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
            Secure Checkout
        </button>
    );
}