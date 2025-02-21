import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import LoggedOutHeader from "../components/Layout/LoggedOutHeader";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("/image/pc.png");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateBackground = () => {
      setBgImage(window.innerWidth <= 768 ? "/image/mobile.png" : "/image/pc.png");
      setIsMobile(window.innerWidth <= 768);
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("ログインに失敗しました: " + error.message);
    } else {
      router.push("/home-window");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ヘッダー */}
      <LoggedOutHeader />

      {/* 背景画像 */}
      <div
        className="absolute inset-0 -z-10 w-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "auto 100%", // 縦の比率を100%維持
          backgroundPosition: "right bottom", // 右端下端に固定
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      />

      {/* メインコンテンツ */}
      <main
        className={`relative mx-auto flex h-[calc(100vh-120px)] max-w-5xl flex-col 
          ${isMobile ? "items-center justify-center text-center" : "items-start justify-center px-6 text-left"}
        `}
      >
        <form className="w-full max-w-md rounded-lg bg-white p-6 shadow-md" onSubmit={handleLogin}>
          {/* アイコン部分 */}
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
            <FaSignInAlt className="text-4xl text-gray-600" />
          </div>
          <label className="block text-center text-2xl font-bold text-gray-700">アカウントにサインイン</label>
          <div className="mb-4"></div>

          {/* エラーメッセージ */}
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <div className="mb-4">
            <label className="block pl-4 text-left text-gray-700">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="mt-1 w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block pl-4 text-left text-gray-700">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="・・・・・・"
              className="mt-1 w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-4 w-full rounded bg-blue-500 px-6 py-3 text-lg font-bold text-white shadow-md transition-all hover:bg-blue-600"
            >
              ログイン
            </button>
          </div>

          {/* サインアップリンク */}
          <p className="mt-4 text-center text-gray-600">
            アカウントをお持ちでないですか？{" "}
            <Link href="/signup">
              <span className="text-blue-500 underline hover:text-blue-800">サインアップ</span>
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
