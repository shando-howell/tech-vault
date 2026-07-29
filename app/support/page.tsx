"use client";

import { useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            const response = await fetch(`${apiUrl}/api/admin/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Failed to submit.');

            // Show success message and clear the form
            setStatusMessage({ type: 'success', text: "Message sent successfully! Our team will reach out soon." });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Failed to send message.", error);
            setStatusMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-6xl mx-auto">
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h1>
                    <p className="text-lg text-gray-600">Have a question about an order or need general support? Let us know.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* LEFT: Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        {statusMessage && (
                            <span className={`p-4 mb-6 rounded-md ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {statusMessage.text}
                            </span>
                        )}
                        <h2 className="text-2xl text-gray-900 font-bold mt-6 mb-6">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        className="w-full text-gray-900 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-black
                                        focus:outline-none"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        className="w-full border text-gray-900 border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-black
                                        focus:outline-none"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        required
                                        className="w-full border text-gray-900 border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-black
                                        focus:outline-none"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        required
                                        rows={5}
                                        className="w-full text-gray-900 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-black
                                        focus:outline-none"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-500 
                                    transition-colors disabled:bg-gray-400"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                        </form>
                    </div>

                    {/* RIGHT: FAQ Section */}
                    <div>
                        <h2 className="text-2xl text-gray-900 font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">What is your return policy?</h3>
                                <p className="text-gray-600 mt-2">
                                    We accept returns within 30 days of purchase. Items must be in their original
                                    condition with tags attached.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">How long does shipping take?</h3>
                                <p className="text-gray-600 mt-2">
                                    Standard shipping usually takes 3-5 business days. Expedited shipping is available
                                    at checkout for 1-2 day delivery.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">Do you ship internationally?</h3>
                                <p className="text-gray-600 mt-2">
                                    Currently, we only ship within Jamaica, but we are actively working on expanding
                                    our logistics network.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}