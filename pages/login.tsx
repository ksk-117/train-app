// pages/login.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import LoggedOutHeader from "../components/Layout/LoggedOutHeader";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bgImage, setBgImage] = useState("/image/pc.png");

  useEffect(() => {
    const updateBackground = () => {
      setBgImage(window.innerWidth <= 768 ? "/image/mobile.png" : "/image/pc.png");
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push("/view-records");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ヘッダー */}
      <LoggedOutHeader />

      {/* 背景画像 */}
      <div
        className="absolute left-0 -z-10 w-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% auto",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      />

      {/* メインコンテンツ */}
      <main className="relative mx-auto mt-10 flex h-[calc(100vh-120px)] max-w-5xl flex-col items-start justify-center px-6 text-left">
        <h2 className="mb-6 text-3xl font-bold text-black">〇ログイン</h2>
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4">
            <label className="block text-left text-gray-700">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-left text-gray-700">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        </form>
      </main>
    </div>
  );
}
