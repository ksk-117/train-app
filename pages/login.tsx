// pages/login.tsx
import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import LoggedOutHeader from '../components/Layout/LoggedOutHeader';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // ログイン失敗
      alert(error.message);
    } else {
      // data.user がログイン後のユーザー情報などを含む
      router.push('/view-records');
    }
  };

  return (
    <div>
      <LoggedOutHeader />
      <main style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>ログイン</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <button type="submit">ログイン</button>
        </form>
      </main>
    </div>
  );
}
