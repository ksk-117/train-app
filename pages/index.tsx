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
        className="absolute inset-x-0 bottom-0 -z-10 w-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "contain", // 画像の横幅をすべて表示
          backgroundPosition: "bottom", // 画像の下端を画面下に固定
          backgroundRepeat: "no-repeat",
          height: "100vh", // 画面の高さを確保し、足りない場合は空白を残す
        }}
      />

      {/* メインコンテンツ */}
      <main className="relative mx-auto flex h-[calc(100vh-80px)] max-w-5xl flex-col items-start justify-center px-6 text-left">
        <h1 className="stylish-text text-5xl text-black md:text-6xl">
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
