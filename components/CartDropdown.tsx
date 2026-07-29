"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from "@/app/context/CartContext";

export default function CartDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { cart, cartCount, cartTotal } = useCart();

    return (
        <div className="relative">
            {/* Cart Icon & Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>

                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-[11px]
                    shadow-sm text-xs font-bold leading-none text-white animate-sm zoom-in duration-200
                    bg-red-600 rounded-full">
                        {cartCount > 99 ? '99+' : cartCount}
                    </span>
                )}
            </button>

            {/* The Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl
                    shadow-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Your Cart</h3>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Your cart is empty.
                                </p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden
                                        shrink-0">
                                            {item.image_url && (
                                                <Image 
                                                    src={item.image_url} 
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            )}
                                        </div>
                                        <div className="grow min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-medium text-gray-600">Subtotal</span>
                                    <span className="font-bold text-lg text-gray-900">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center bg-black text-white py-3 
                                    rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Go to Checkout
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}