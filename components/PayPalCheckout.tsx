"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface PayPalCheckoutProps {
    userId: string;
    finalTotal: number;
}

export default function PayPalCheckout({ userId, finalTotal }: PayPalCheckoutProps) {
    const [error, setError] = useState("");

    return (
        <div className="w-full mt-4">
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
                <PayPalButtons
                    style={{ layout: "vertical", shape: "rect" }}
                    forceReRender={[finalTotal]}
                    // This fires when the user clicks the button
                    createOrder={async () => {
                        setError("");
                        try {
                            // Call the secure API route
                            const response = await fetch(`${apiUrl}/api/orders/create-paypal-order`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ userId }),
                            });

                            const order = await response.json();

                            console.log("CLIENT ORDER ID CHECK:", order.id)

                            if (order.id) {
                                // Hands the secure ID back to PayPal to launch the popup
                                return order.id;
                            } else {
                                throw new Error("Failed to create order.");
                            }
                        } catch (error) {
                            console.error(error);
                            setError("Could not initiate PayPal checkout.");
                            return "";
                        }
                    }}

                    // This fires after the user successfully pays in the pop up
                    onApprove={async (data, actions) => {
                        try {
                            // Tell PayPal to finalize the transaction
                            await actions.order?.capture();

                            alert("Payment Successful!");
                            // Clear the cart in the database here
                            await fetch(`${apiUrl}/api/cart/${userId}`, {
                                method: "DELETE",
                            });
                            // Instantly update the navbar bubble at 0
                            // refreshCart();
                        } catch (error) {
                            console.error(error);
                            setError("Payment failed to process.");
                        }
                    }}
                />
            </PayPalScriptProvider>

            {error && <p className="text-red-500 text-sm mt-2 font-medium text-center">{error}</p>}
        </div>
    );
}