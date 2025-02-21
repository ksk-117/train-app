// components/Layout/LoggedInTaskbar.tsx
import Link from "next/link";
import React from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { FaSignOutAlt, FaFire, FaPlus, FaDumbbell, FaHome } from "react-icons/fa"; // アイコンをインポート

const LoggedInTaskbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="w-full bg-gray-800 shadow-md" style={{ boxShadow: "0 4px 6px rgba(255, 255, 255, 0.5)" }}>
      {/* ここでタスクバーの下側に白色の影を追加 */}
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2">
        {/* 左側のロゴ */}
        <Link
          href="/home-window"
          className="flex items-center gap-2 text-2xl font-bold text-white hover:text-gray-400"
        >
          <FaFire className="text-red-500"/>
          Training App
        </Link>

        {/* ナビゲーションメニュー */}
        <div className="flex items-center space-x-4">
          <Link href="/home-window" className="flex items-center text-sm font-medium text-white hover:underline">
            <div className="flex size-6 items-center justify-center rounded-full bg-white">
              <FaHome className="text-lg text-gray-800" />
            </div>
            <span className="ml-2 hidden sm:inline">練習カレンダー</span>
          </Link>
          <Link href="/create-record" className="flex items-center text-sm font-medium text-white hover:underline">
            <div className="flex size-6 items-center justify-center rounded-full bg-white">
              <FaPlus className="text-lg text-gray-800" />
            </div>
            <span className="ml-2 hidden sm:inline">記録を追加</span>
          </Link>
          <Link href="/edit-menu" className="flex items-center text-sm font-medium text-white hover:underline">
            <div className="flex size-6 items-center justify-center rounded-full bg-white">
              <FaDumbbell className="text-lg text-gray-800" />
            </div>
            <span className="ml-2 hidden sm:inline">メニュー管理</span>
          </Link>
        </div>

        {/* 右側のログアウトボタン */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 rounded border border-white bg-gray-800 px-3 py-1 text-sm font-medium text-white transition-all hover:bg-gray-600"
        >
          <FaSignOutAlt className="text-white" />
          <span>ログアウト</span>
        </button>
      </div>
    </nav>
  );
};

export default LoggedInTaskbar;
