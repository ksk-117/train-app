/* components/Layout/LoggedOutHeader.tsx */

import Link from "next/link";
import React from "react";
import { FaUserPlus, FaSignInAlt, FaFire } from "react-icons/fa"; // アイコンをインポート

const LoggedOutHeader: React.FC = () => {
  return (
    <header className="w-full bg-white py-3 shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
        {/* 左側：ロゴ */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-black hover:text-gray-700">
          <FaFire className="text-black" />
          Training App
        </Link>

        {/* 右側：ナビゲーション */}
        <nav className="flex items-center gap-4">
          <Link href="/about">
            <span className="text-sm font-medium text-black hover:underline">About</span>
          </Link>
          <Link href="/login">
            <span className="flex items-center gap-1 rounded border border-black px-3 py-1 text-sm font-medium text-black hover:bg-gray-100">
              <FaSignInAlt className="text-black" />
              Log in
            </span>
          </Link>
          <Link href="/signup">
            <span className="flex items-center gap-1 rounded border border-black bg-black px-3 py-1 text-sm font-medium text-white hover:bg-gray-800">
              <FaUserPlus className="text-white" />
              Sign up
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default LoggedOutHeader;
