import Link from 'next/link';
import React from 'react';

const LoggedOutHeader: React.FC = () => {
  return (
    <header className="border-b-4 border-blue-900 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-lg font-bold text-gray-900">
        {/* Left Side: App Name */}
        <Link href="/" className="text-2xl text-blue-600 hover:text-blue-800">
          Training App
        </Link>

        {/* Right Side: Navigation Links */}
        <nav className="flex items-center gap-x-6">
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
          <Link href="/about" className="text-blue-600 hover:text-blue-800">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default LoggedOutHeader;
