// pages/create-record/index.tsx
import React, { useState, useEffect } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type Category = {
  id: number;
  name: string;
};

export default function CreateRecordPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [load, setLoad] = useState<number>(0);
  const [menuCategoryId, setMenuCategoryId] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [reflection, setReflection] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // v2では session() が廃止されたため getSession() を使う
    const checkSessionAndFetchCategories = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session fetch error:', error);
        return;
      }

      // 未ログインならログインページへ
      if (!session) {
        router.push('/login');
        return;
      }

      // カテゴリを取得
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');
      if (catError) {
        console.error('Categories fetch error:', catError);
      } else if (catData) {
        setCategories(catData);
      }
    };

    checkSessionAndFetchCategories();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // セッションを再度取得（v2）
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      alert('エラーが発生しました: ' + error.message);
      return;
    }

    if (!session) {
      // 未ログイン状態の場合の処理
      router.push('/login');
      return;
    }

    const { user } = session;

    // トレーニング記録テーブルへINSERT
    const { data: insertData, error: insertError } = await supabase
      .from('training_records')
      .insert([
        {
          user_id: user?.id,
          date,
          load,
          category_id: menuCategoryId,
          count,
          reflection,
        },
      ]);

    if (insertError) {
      alert(insertError.message);
    } else {
      alert('記録を追加しました');
      router.push('/view-records');
    }
  };

  return (
    <div>
      {/* ログイン状態のタスクバー */}
      <LoggedInTaskbar />
      <main style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>記録作成</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>練習負荷</label>
            <input
              type="number"
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>練習メニューカテゴリ</label>
            <select
              value={menuCategoryId ?? ''}
              onChange={(e) => setMenuCategoryId(Number(e.target.value))}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            >
              <option value="" disabled>
                選択してください
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>回数</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>反省・メモ</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <button type="submit">登録</button>
        </form>
      </main>
    </div>
  );
}
