import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white px-6 py-3 flex items-center">
      <Link
        to="/"
        className="text-lg font-semibold text-gray-800 hover:text-black"
      >
        Koset
      </Link>

      <div className="ml-auto flex items-center gap-6">
        <Link
          to="/login"
          className="text-gray-600 hover:text-gray-900 transition"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
