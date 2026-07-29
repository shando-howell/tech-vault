"use client";

import Link from 'next/link';
import { useUser, Show, UserButton, SignInButton } from "@clerk/nextjs";
import CartDropdown from './CartDropdown';

export default function Navbar() {
    const { user, isLoaded } = useUser();

    // Safely check if the logged-in user has the admin role in their metadata
    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-tech-background/70 border-b
        border-tech-border">
            <div className=" px-8 h-16 flex items-center justify-between">
                <div className="flex-1">    
                    {/* Branding */}
                    <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-gray-300 transition-colors">
                        Tech<span className="text-tech-accent">Vault</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link href="/products" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Store
                    </Link>
                    <Link href="/support" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Support
                    </Link>

                    {isLoaded && isAdmin && (
                        <Link
                            href="/admin"
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Admin Dashboard
                        </Link>
                    )}

                    <CartDropdown />

                    {/* Clerk Authentication UI */}
                    <div className="flex items-center gap-4">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-white bg-tech-surface border
                                    border-tech-border px-4 py-2 rounded-lg hover:border-tech-accent transition-all"
                                >
                                    Sign In
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when="signed-in">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8 rounded-lg border border-tech-border"
                                    }
                                }}
                            />
                        </Show>
                    </div>
                </div>
            </div>
        </nav>
    )
}