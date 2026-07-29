import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();

    // Read the authorized admin ID from the environment
    const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

    // If there is no user or the ID doesn't match, kick them out
    if (!userId || userId !== adminId) {
        redirect('/');
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-tech-background">
            {/* Admin Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-black text-white flex flex-col gap-6 p-4">
                <h2 className="text-xl font-bold tracking-wider">Store Admin</h2>
                <nav className="flex flex-col gap-4 text-sm font-medium">
                    <Link href="/admin" className="hover:text-gray-300 transition-colors">
                        Dashboard
                    </Link>
                     <Link href="/admin/products" className="hover:text-gray-300 transition-colors">
                        Manage Products
                    </Link>
                    <Link href="/admin/tickets" className="hover:text-gray-300 transition-colors">
                        Support Tickets
                    </Link>
                    <Link href="/" className="hover:text-gray-300 transition-colors mt-8 border-t 
                     border-gray-700 pt-4">
                        Back to Store
                    </Link>
                </nav>
            </aside>

            {/* Admin Content Area */}
            <main className="flex-1 overflow-y-auto px-6 mt-2">
                {children}
            </main>
        </div>
    )
}