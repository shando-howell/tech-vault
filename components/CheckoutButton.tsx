'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutButton() {
    const { userId } = useAuth();
    const router = useRouter();

    // Track loading state so users can't click "Buy" twice
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSimulatedCheckout = async () => {
        if (!userId) return;

        setIsProcessing(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${apiUrl}/api/checkout/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to process checkout.");
            }

            // TODO: Clear cart

            // If successful, the backend cleared the DB cart.
            // Redirect the user to a success page and pass the order number in the URL!
            router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
        } catch (error) {
            console.error("Checkout Error:", error);
            setErrorMessage("An error occured in simulated cheeckout.")
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            <button
                onClick={handleSimulatedCheckout}
                disabled={isProcessing}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-medium hover:bg-emerald-400
                transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
                {isProcessing ? "Processing Order..." : "Complete Checkout"}
            </button>

            {errorMessage && (
                <p className="text-red-600 text-sm text-center">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}