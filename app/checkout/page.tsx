"use client";

import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext'
import PayPalCheckout from '@/components/PayPalCheckout';

export default function CheckoutPage() {
    const { userId } = useAuth()
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    // Calculate simple mock taxes and shipping
    const tax = cartTotal * 0.08;
    const shipping = cartTotal > 0 ? 15.00 : 0;
    const finalTotal = cartTotal + tax + shipping;

    if (!userId) {
        return <div className="p-8 text-center bg-tech-background text-gray-200">
            Please log in to view your cart.
        </div>
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-tech-background flex flex-col items-center justify-center px-6">
                <h1 className="text-3xl font-extrabold text-gray-200 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-200 mb-8">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/products" className="bg-black text-white px-8 py-3 rounded-lg font-bold
                hover:bg-gray-800 transition-colors">
                    Start Shopping
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-tech-background py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-200 mb-10">Checkout</h1>
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT: Cart Items Review */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Review Your Items</h2>

                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6
                                    border-b border-gray-100 last:border-0 last:pb-0">

                                        {/* Item Image */}
                                        <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
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

                                        {/* Item Details */}
                                        <div className="grow">
                                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Price: ${Number(item.price).toFixed(2)}
                                            </p>
                                            {item.quantity >= item.stock_quantity && (
                                                <p className="text-red-600 tex-xs font-medium mt-1">
                                                    Maximum stock reached.
                                                </p>
                                            )}
                                        </div>

                                        {/* Quantity Controls & Delete */}
                                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">

                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg 
                                                    transition-colors focus:outline-none"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    &minus;
                                                </button>
                                                <span className="w-10 text-center font-medium text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock_quantity}
                                                    className={`px-3 py-1.5 rounded-r-lg transition-colors focus:outline-none ${
                                                        item.quantity >= item.stock_quantity
                                                            ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    &#43;
                                                </button>
                                            </div>

                                            {/* Total Price and Trash Icon */}
                                            <div className="flex items-center gap-4">
                                                <p className="font-bold text-gray-900 w-20 text-right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                                                    aria-label="Remove Item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 text-gray-600 border-b border-gray-100 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Tax (8%)</span>
                                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-extrabold text-gray-900">
                                    ${finalTotal.toFixed(2)}
                                </span>
                            </div>

                            <PayPalCheckout userId={userId} finalTotal={finalTotal}/>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}