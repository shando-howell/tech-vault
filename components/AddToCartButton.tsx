"use client";

import { useCart } from '@/app/context/CartContext';

interface AddToCartButtonProps {
    product: { 
        id: number; 
        name: string; 
        price: string | number; 
        image_url: string;
        stock_quantity: number;
    };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    // Check if stock is 0 or less
    const isOutOfStock = product.stock_quantity <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        // AGGRESSIVE CLEANUP: Strip out anything that isn't a number or a decimal point
        const rawPrice = String(product.price || "0");
        const cleanPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

        // Explicitly form the data before it hits the cart context
        addToCart({
            id: product.id,
            name: product.name,
            price: cleanPrice,
            image_url: product.image_url,
            stock_quantity: product.stock_quantity
        })
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full text-lg font-bold py-4 rounded-xl transition-all ${
                    isOutOfStock
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-400 active:scale=[0.98]'
                }`}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}