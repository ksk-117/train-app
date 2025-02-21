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
      <main className="relative mx-auto flex h-[calc(100vh-80px)] max-w-5xl flex-col items-start justify-center px-6 text-left">
        <h1 className="stylish-text text-5xl text-black drop-shadow-[3px_3px_0px_#ffffff] md:text-6xl">
          過去の自分を超えろ
        </h1>
        <p className="mt-6 text-xl text-black drop-shadow-[1px_1px_0px_#ffffff] md:text-2xl">
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
