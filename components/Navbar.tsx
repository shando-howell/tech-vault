"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useUser, Show, UserButton, SignInButton  } from '@clerk/nextjs';

import CartDropdown from './CartDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const { isLoaded, user } = useUser();

  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-tech-background/70 border-b border-tech-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider">
              Tech<span className="text-emerald-600">Vault</span>
            </Link>
          </div>

          {/* Hamburger Button (Always rendered, but visually hidden on large screens via CSS) */}
          <div className="md:hidden flex">
            <CartDropdown />

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center py-2 px-4 rounded-md text-gray-200 hover:text-gray-200 hover:bg-tech-background focus:outline-none"
            >
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex ml-10 space-x-6 items-center">
            <Link href="/products" className="hover:text-emerald-600 px-3 py-2 rounded-md font-medium">Shop</Link>

            <Link href="/support" className="hover:text-emerald-600 px-3 py-2 rounded-md font-medium">FAQs</Link>
            
            {isLoaded && isAdmin && (
                <Link href="/admin" className="hover:text-emerald-600 text-emerald-500 px-3 py-2 rounded-md font-medium">Admin Dashboard</Link>
            )}

            <CartDropdown />

            <div className="flex items-center gap-4">
                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <button>
                            Sign In
                        </button>
                    </SignInButton>
                </Show>
                <Show when="signed-in">
                    <UserButton
                        appearance={{
                            elements: {
                                avarBox: "w-8 h-8 rounded-lg border border-tech-border"
                            }
                        }}
                    />
                </Show>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Absolute positioning ensures it isn't cut off) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden bg-tech-background border-t border-gray-800 shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link href="/products" onClick={closeMenu} className="block hover:bg-emerald-600 px-3 py-2 rounded-md font-medium">Shop</Link>

            <Link href="/" onClick={closeMenu} className="block hover:bg-emerald-600 px-3 py-2 rounded-md font-medium">FAQs</Link>
            
            <div className="flex items-center gap-4 px-3">
                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <button>
                            Sign In
                        </button>
                    </SignInButton>
                </Show>
                <Show when="signed-in">
                    <UserButton
                        appearance={{
                            elements: {
                                avarBox: "w-8 h-8 rounded-lg border border-tech-border"
                            }
                        }}
                    />
                </Show>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}