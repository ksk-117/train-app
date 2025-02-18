// pages/create-record/index.tsx
import React, { useState, useEffect } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type Category = {
  id: number;
  name: string;
  unit: string;
};

export default function CreateRecordPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [load, setLoad] = useState<number>(1);
  const [menuCategoryId, setMenuCategoryId] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [reflection, setReflection] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // セッションをチェックし、カテゴリを取得
    const checkSessionAndFetchCategories = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session fetch error:', error);
        return;
      }

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

    // 入力チェック
    if (!date) {
      alert('日付を入力してください');
      return;
    }

    if (!menuCategoryId) {
      alert('練習メニューを選択してください');
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      alert('エラーが発生しました: ' + error.message);
      return;
    }

    if (!session) {
      router.push('/login');
      return;
    }

    const { user } = session;

    // 既存データの確認（日付 + ユーザID）
    const { data: existingRecords, error: fetchError } = await supabase
      .from('training_records')
      .select('id')
      .eq('user_id', user?.id)
      .eq('date', date);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      alert('データの確認中にエラーが発生しました');
      return;
    }

    if (existingRecords && existingRecords.length > 0) {
      // 既存データがある場合、削除して新しいデータを登録
      const confirmUpdate = window.confirm(
        '既存の記録が見つかりました。上書き（削除して新規登録）しますか？'
      );

      if (!confirmUpdate) return;

      // 既存データを削除
      const { error: deleteError } = await supabase
        .from('training_records')
        .delete()
        .eq('user_id', user?.id)
        .eq('date', date);

      if (deleteError) {
        alert('削除中にエラーが発生しました: ' + deleteError.message);
        return;
      }
    }

    // 新規登録
    const { error: insertError } = await supabase
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
      console.error('Insert error:', insertError);
      alert(insertError.message);
    } else {
      alert('記録を追加しました');
      router.push('/view-records');
    }
  };

  // 選択されたメニューの単位を取得
  const selectedUnit = categories.find((cat) => cat.id === menuCategoryId)?.unit || '';

  return (
    <div>
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
            <label>練習負荷 (1~10)</label>
            <input
              type="number"
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              min="1"
              max="10"
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>

          <div>
            <label>練習メニュー</label>
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
                  {cat.name} ({cat.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>回数</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min="0"
                required
                style={{ width: '80%', marginRight: '5px' }}
              />
              <span>{selectedUnit}</span>
            </div>
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
