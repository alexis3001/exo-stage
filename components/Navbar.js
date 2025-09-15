"use client"

import { Link } from "next/link";


export default function Navbar({isAuthenticated}) {
    return(
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">
            <Link href="/">RestosFinder</Link>
            </div>
            
            <div className="flex gap-4">
                <Link href="/" className="hover:text-yellow-400 transition">
                acceuil
                </Link>

                {isAuthenticated && (
                    <Link href="/profile" className="hover:text-yellow-400 transition">
                        profil
                    </Link>
                )}
            </div>
            </nav>
    );
}



