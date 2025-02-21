// components/Layout/LoggedInTaskbar.tsx
import Link from "next/link";
import React from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { FaSignOutAlt, FaFire, FaPlus, FaDumbbell, FaEye } from "react-icons/fa"; // アイコンをインポート

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
        <div className="hidden items-center space-x-4 sm:flex"> {/* sm（small）以上で表示 */}
          <Link href="/create-record" className="text-sm font-medium text-white hover:underline">
            記録を追加
          </Link>
          <Link href="/edit-menu" className="text-sm font-medium text-white hover:underline">
            メニュー管理
          </Link>
          <Link href="/view-records" className="text-sm font-medium text-white hover:underline">
            記録を見る
          </Link>
        </div>

        {/* モバイル版のアイコン */}
        <div className="flex items-center space-x-4 sm:hidden"> {/* sm（small）以下で表示 */}
          <Link
            href="/create-record"
            className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-black"
          >
            <FaPlus className="text-lg" />
          </Link>
          <Link
            href="/edit-menu"
            className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-black"
          >
            <FaDumbbell className="text-lg" />
          </Link>
          <Link
            href="/view-records"
            className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-black"
          >
            <FaEye className="text-lg" />
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
