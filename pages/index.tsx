// pages/index.tsx

import React, { useEffect, useState } from "react";
import LoggedOutHeader from "../components/Layout/LoggedOutHeader";

export default function HomePage() {
  const [bgImage, setBgImage] = useState("/image/pc.png");

  useEffect(() => {
    const updateBackground = () => {
      setBgImage(window.innerWidth <= 768 ? "/image/mobile.png" : "/image/pc.png");
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ヘッダー */}
      <LoggedOutHeader />

      {/* 背景画像 */}
      <div
        className="absolute left-0 -z-10 w-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% auto", // 横幅100%、縦横比維持
          backgroundPosition: "bottom", // 画面下部に配置
          backgroundRepeat: "no-repeat",
          height: "calc(100vh - 80px)", // ヘッダー分を差し引く
        }}
      />

      {/* メインコンテンツ */}
      <main className="relative mx-auto flex h-[calc(100vh-80px)] max-w-5xl flex-col items-start justify-center px-6 text-left">
        <h1 className="stylish-text text-5xl font-bold text-black md:text-6xl">
          過去の自分を超えろ
        </h1>
        <p className="mt-6 text-xl text-black md:text-2xl">
          練習記録を管理して、計画的に成長を目指しましょう。
        </p>
        <button
          className="mt-8 rounded-lg bg-blue-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-blue-700"
          onClick={() => (window.location.href = "/login")}
        >
          今すぐ始める
        </button>
      </main>
    </div>
  );
}
