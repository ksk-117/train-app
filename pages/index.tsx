// pages/index.tsx
import React from 'react';
import LoggedOutHeader from '../components/Layout/LoggedOutHeader';

export default function HomePage() {
  return (
    <div>
      <LoggedOutHeader />
      <main style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>過去の自分を超える</h1>
        <p>練習記録を管理して、計画的に成長を目指しましょう。</p>
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            window.location.href = '/login'; 
          }}
        >
          今すぐ始める
        </button>
      </main>
    </div>
  );
}
