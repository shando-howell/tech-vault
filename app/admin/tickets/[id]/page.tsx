import Link from 'next/link';
import ResolveTicketButton from '@/components/ResolveTicketButton';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Ticket {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

async function getTicket(id: string): Promise<Ticket> {
    const res = await fetch(`${apiUrl}/api/admin/tickets/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch ticket.');
    const data = await res.json();
    return data.ticket;
}

export default async function AdminTicketViewPage({
    params,
} : {
    params: Promise<{ id: string }>
}) {
    // Await the dynamic URL parameters
    const resolvedParams = await params;
    const ticket = await getTicket(resolvedParams.id);

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            {/* Header and Back Button */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/tickets" className="text-gray-400 hover:text-emerald-600 transition-colors">
                        &larr; Back to Tickets
                    </Link>
                    <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    ticket.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                    {ticket.status.toUpperCase()}
                </span>

                <ResolveTicketButton ticketId={ticket.id} currentStatus={ticket.status} />
            </div>

            {/* Ticket Details Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">

                {/* Customer Info Bar */}
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Customer</p>
                        <p className="text-gray-900">{ticket.name}</p>
                        <p className="text-gray-600 text-sm">{ticket.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 font-medium">Submitted On</p>
                        <p className="text-gray-900">{new Date(ticket.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-sm">{new Date(ticket.created_at).toLocaleTimeString()}</p>
                    </div>
                </div>

                {/* Message Content */}
                <div className="px-6 py-8">
                    <h2 className="text-xl font-semibold text-gray-900 border-b mb-6 pb-4">
                        {ticket.subject}
                    </h2>
                    <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {ticket.message}
                    </div>
                </div>
            </div>
        </main>
    );
}