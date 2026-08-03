"use client";

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
    const { getToken } = useAuth();
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, lowStock: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Generate a fresh JWT toke  for the backend
                const token = await getToken();

                const response = await fetch(`${apiUrl}/api/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    cache: 'no-store'
                });
                const data = await response.json();

                if (data.success) {
                    setStats(data.stats);
                    setRecentOrders(data.recentOrders);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-tech-background flex items-center justify-center">
                <p className="text-gray-200 font-medium animate-pulse">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-tech-background text-white py-4">
            <div className="max-w-1xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-8">
                    Dashboard
                </h1>
            </div>

            {/* SECTION ONE: Business Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.lowStock}</p>
                </div>
            </div>

            {/* SECTION TWO: Recent Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm">
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Customer ID</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Map through your actual orders here */}
                            {/* eslint-disable-next-line */}
                            {recentOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-900">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-sm text-gray-900">{order.user_id}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-bold text-gray-900 text-right">
                                        ${parseFloat(order.total_amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-t text-center text-gray-600">
                                        No recent tansactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}