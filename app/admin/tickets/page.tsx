import { headers } from 'next/headers';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Ticket {
    id: number;
    name: string;
    email: string;
    subject: string;
    status: string;
    created_at: string;
}

// Update the expected response interface
interface PaginatedTickets {
    tickets: Ticket[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

// Fetch the data from the API
async function getTickets(page: number): Promise<PaginatedTickets> {
    const headersList = await headers();
    const incomingCookies = headersList.get('cookie') || '';

    const response = await fetch(`${apiUrl}/api/admin/tickets?page=${page}&limit=10`, {
        cache: 'no-store',
        headers: {
            'Cookie': incomingCookies
        }
    });

    if (!response.ok) throw new Error('Failed to fetch tickets.');
    const data = await response.json();

    return {
        tickets: data.tickets,
        pagination: data.pagination
    };
}

export default async function AdminTicketsPage({
    searchParams
} : {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Await the searchParams to get the current page
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;

    const data = await getTickets(currentPage);
    const { tickets, pagination } = data;

    return (
        <main className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Support Tickets</h1>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">Subject</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">Date</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                                    No support tickets found.
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 font-semibold rounded-full ${
                                            ticket.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {ticket.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {ticket.subject}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right font-medium'>
                                        <Link href={`/admin/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* The Pagination Controls */}
            <div className="mt-6 mb-4 flex justify-between items-center bg-tech-background shadow rounded-lg">
                <span className="text-sm text-gray-200">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
                    <span className="text-gray-200 ml-1">({pagination.totalItems} total tickets)</span>
                </span>
            </div>

            <div className="flex space-x-2">
                {pagination.currentPage > 1 ? (
                    <Link
                        href={`/admin/tickets?page=${pagination.currentPage - 1}`}
                        className="px-4 py-2 border border-gray-300 rounded text-sm font-medium
                        hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="px-4 py-2 border rounded text-sm font-medium 
                    text-gray-200 cursor-not-allowed bg-black">
                        Previous
                    </span>
                )}

                {pagination.currentPage < pagination.totalPages ? (
                    <Link
                        href={`/admin/tickets?page=${pagination.currentPage + 1}`}
                        className="px-4 py-2 border-gray-200 rounded text-sm font-medium hover:bg-black text-gray-200 transition-colors"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-200 cursor-not-allowed bg-black">
                        Next
                    </span>
                )}
            </div>
        </main>
    );
}