// pages/about.tsx
import React from 'react';
import LoggedOutHeader from '../components/Layout/LoggedOutHeader';

export default function AboutPage() {
  return (
    <div>
      <LoggedOutHeader />
      <main style={{ padding: '20px' }}>
        <h2>このアプリについて</h2>
        <p>
          このアプリでは、日々の部活やトレーニングの記録を管理し、
          練習負荷やメニューごとの達成状況を可視化することで、
          計画的な成長をサポートします。
        </p>
        <ul>
          <li>カレンダー上での記録閲覧</li>
          <li>練習メニューごとの統計分析</li>
          <li>簡単なフォームからの記録作成</li>
          <li>練習メニューカテゴリの追加・編集</li>
        </ul>
      </main>
    </div>
  );
}
