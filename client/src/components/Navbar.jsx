import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b z-10">
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-black">
          Koset
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 transition font-medium px-3 py-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}