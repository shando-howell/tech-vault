"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Define what a Cart Item looks like (Product + Quantity)
export interface CartItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    stock_quantity: number
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { userId } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);

    // Add item or increase quantity if it already exists
    const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                // GUARD: Do not allow adding more than what is in stock
                if (existingItem.quantity >= product.stock_quantity) return prevCart;

                return prevCart.map((item) => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });

        if (!userId) {
            console.warn("User not logged in. Saved to local state only.");
            return;
        }

        try {
            // Send it to the server
            const response = await fetch(`${apiUrl}/api/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: product.id,
                    quantity: 1
                }),
            });

            if (!response.ok) {
                console.error("Backend failed to save cart item.");
            }
        } catch (error) {
            console.error("Network error adding to cart:", error);
        }
    }

    // Update exact quantity from the checkout page
    const updateQuantity = (id: number, quantity: number) => {
        setCart((prevCart) => 
            prevCart.map((item) => {
                if (item.id === id) {
                    // Ensure quantity stays between 1 and max stock
                    const safeQuantity = Math.max(1, Math.min(quantity, item.stock_quantity));
                    return { ...item, quantity: safeQuantity };
                }
                return item;
            })
        );
    };

    // Remove item completely
    const removeFromCart = async (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));

        // Tell the database to remove the row
        if (userId) {
            try {
                const response = await fetch(`${apiUrl}/api/cart/${userId}` , {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        userId: userId
                    }),
                });

                if (!response.ok) {
                    console.log("Server failed to delete item.")
                }
            } catch (error) {
                console.error("Network error removing from cart:", error);
            }
        }
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal }}>
            { children }
        </CartContext.Provider>
    );
}

// Custom hook so any component can easily grab the cart data
export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider.");
    return context;
}