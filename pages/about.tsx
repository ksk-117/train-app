// pages/about.tsx
import React, { useEffect, useState } from "react";
import LoggedOutHeader from "../components/Layout/LoggedOutHeader";

export default function AboutPage() {
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
          backgroundSize: "100% auto",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      />

      {/* メインコンテンツ */}
      <main className="relative mx-auto mt-16 flex h-[calc(100vh-135px)] max-w-5xl flex-col items-start justify-start px-6 text-left">
        <h1 className="text-4xl font-bold text-black">このアプリについて</h1>
        <p className="mt-4 text-lg text-black">
          このアプリは、トレーニング記録を管理し、計画的に成長するためのツールです。
          ユーザーは日々の練習メニューを記録し、進捗を可視化することができます。
        </p>
      </main>
    </div>
  );
}
