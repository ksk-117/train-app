// pages/signup.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import LoggedOutHeader from '../components/Layout/LoggedOutHeader';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('登録に失敗しました');
      return;
    }
    router.push('/home-window');
  };

  return (
    <div className="signup-page">
      <LoggedOutHeader />
      <main className="auth-container">
        {/* アイコン部分 */}
        <div className="auth-icon">👤</div>

        {/* タイトル・サブタイトル */}
        <h2 className="auth-title text-black">アカウントを作成</h2> {/* ✅ 黒文字に変更 */}
        <p className="auth-subtitle">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login">
            <span className="auth-link">サインイン</span>
          </Link>
        </p>

        {/* 入力フォーム */}
        <form onSubmit={handleSignUp} className="auth-form">
          <label className="text-black">メールアドレス</label> {/* ✅ 黒文字に変更 */}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label className="text-black">パスワード</label> {/* ✅ 黒文字に変更 */}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="auth-button">アカウントを作成</button>
        </form>
      </main>
    </div>
  );
}
