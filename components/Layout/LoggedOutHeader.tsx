// components/Layout/LoggedOutHeader.tsx
import Link from 'next/link';
import React from 'react';

const LoggedOutHeader: React.FC = () => {
  return (
    <header style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f5f5f5' }}>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/about">About</Link>
    </header>
  );
};

export default LoggedOutHeader;
