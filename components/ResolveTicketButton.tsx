'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ResolveTicketButton({
    ticketId,
    currentStatus
} : {
    ticketId: number;
    currentStatus: string;
}) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    // If the ticket is already resolved, hide the button completely
    if (currentStatus === 'resolved') {
        return null;
    }

    const handleResolve = async () => {
        setIsUpdating(true);

        try {
            const res = await fetch(`${apiUrl}/api/admin/tickets/${ticketId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'resolved' }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Clear the server cache and refetch the page data
            router.refresh();
        } catch (error) {
            console.error("Error updating ticket:", error);
            alert("Failed to mark ticket as resolved.");
            setIsUpdating(false);
        }
    };

    return (
        <button
            onClick={handleResolve}
            disabled={isUpdating}
            className="ml-4 bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded
            hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
            {isUpdating ? 'Updating...' : 'Mark as Resolved'}
        </button>
    );
}