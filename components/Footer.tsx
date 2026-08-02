import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-gray-200 py-12 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Branding & System Status */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">Tech<span className="text-emerald-600">Vault</span></h3>
                    <p className="text-sm leading-relaxed">
                        High-performance e-commerce platform built for scale.
                    </p>
                    <div className="flex items-center space-x-2 mt-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                            bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                        </span>
                        <span className="text-xs font-mono text-emerald-600 tracking-wider">SYSTEMS OPERATIONAL</span>
                    </div>
                </div>

                {/* Platform Navigation */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Architecture</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/products" className="hover:text-emerald-600 transition-colors">Inventory Grid</Link>
                        </li>
                        <li>
                            <Link href="/admin" className="hover:text-emerald-600 transition-colors">Admin Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/support" className="hover:text-emerald-600 transition-colors">Customer Support</Link>
                        </li>
                    </ul>
                </div>

                {/* Stack Info */}
                <div>
                    <h4 className="text-gray-200 font-semibold mb-4">Engineered With</h4>
                    <ul className="space-y-2 text-sm font-mono">
                        <li>Next.js</li>
                        <li>Node.js / Express</li>
                        <li>PostgreSQL</li>
                    </ul>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="https://portfolio-seven-mocha-r1vvx66hik.vercel.app/" target="_blank" className="hover:text-emerald-600 transition-colors">Developer Portfolio</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-4 md:px-16 mt-12 pt-8 border-t border-gray-800 flex flex-col text-xs font-mono">
                <p>&copy; {new Date().getFullYear()} TechVault. All rights reserved.</p>
                <p className="mt-4 py-2 md:mt-0 text-gray-200">v1.0.0-beta</p>
            </div>
        </footer>
    );
}