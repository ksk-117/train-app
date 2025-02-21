// components/Layout/LoggedInTaskbar.tsx
import Link from 'next/link';
import React from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

const LoggedInTaskbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav style={{ display: 'flex', gap: '16px', padding: '16px', background: '#cfffd0' }}>
      <Link href="/home-window">home</Link>
      <Link href="/create-record">記録作成</Link>
      <Link href="/edit-menu">メニュー編集</Link>
      <button onClick={handleLogout}>ログアウト</button>
    </nav>
  );
};

export default LoggedInTaskbar;
