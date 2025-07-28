import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden relative z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
                <svg
                    className="h-6 w-6 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    {open ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Full-screen menu panel */}
            {open && (
                <nav className="fixed inset-0 z-50 bg-gray-800 text-gray-300 p-6">
                    {/* Close button */}
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="absolute top-4 right-4 text-3xl text-gray-300"
                    >
                        &times;
                    </button>
                    {/* Menu Links */}
                    <ul className="flex flex-col gap-6 mt-16 text-xl text-gray-300">
                        <li>
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="hover:text-white"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/aliases"
                                onClick={() => setOpen(false)}
                                className="hover:text-white"
                            >
                                Aliases
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/articles"
                                onClick={() => setOpen(false)}
                                className="hover:text-white"
                            >
                                Articles
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categories"
                                onClick={() => setOpen(false)}
                                className="hover:text-white"
                            >
                             Categories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/tools"
                                onClick={() => setOpen(false)}
                                className="hover:text-white"
                            >
                                Tools
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
