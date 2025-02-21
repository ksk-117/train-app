// pages/create-record/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';

type Category = {
  id: number;
  name: string;
  unit: string;
};

export default function CreateRecordPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [load, setLoad] = useState<number>(1);
  const [reflection, setReflection] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIdList, setCategoryIdList] = useState<(number | null)[]>([null]); // 最初は1つのみ
  const [countList, setCountList] = useState<number[]>([0]); // 最初は1つのみ

  useEffect(() => {
    // 認証チェック & カテゴリ取得
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
      // カテゴリ一覧取得
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) {
        setCategories(catData);
      }
    };
    checkSessionAndFetchCategories();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session || error) {
      alert('セッションがありません。ログインしてください。');
      router.push('/login');
      return;
    }

    // 既存のデータを削除 (日付+user_id)
    await supabase
      .from('training_records')
      .delete()
      .eq('user_id', session.user?.id)
      .eq('date', date);

    // INSERT用オブジェクト作成 (category_id1, count1, ...)
    const insertData: any = {
      user_id: session.user.id,
      date,
      load,
      reflection,
    };

    for (let i = 0; i < 10; i++) {
      insertData[`category_id${i + 1}`] = categoryIdList[i] ?? null;
      insertData[`count${i + 1}`] = countList[i] ?? 0;
    }

    // 新規挿入
    const { error: insertError } = await supabase.from('training_records').insert([insertData]);

    if (insertError) {
      console.error('Insert error:', insertError);
      alert(insertError.message);
    } else {
      alert('記録を追加しました');
      router.push('/view-records');
    }
  };

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ maxWidth: 600, margin: '50px auto' }}>
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
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <hr />

          {categoryIdList.map((categoryId, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
              <h4>メニュー {index + 1}</h4>
              <div>
                <label>カテゴリ</label>
                <select
                  value={categoryId ?? ''}
                  onChange={(e) => {
                    const newCategoryIds = [...categoryIdList];
                    newCategoryIds[index] = e.target.value ? Number(e.target.value) : null;
                    setCategoryIdList(newCategoryIds);
                  }}
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  <option value="">選択してください</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>回数</label>
                <input
                  type="number"
                  value={countList[index]}
                  onChange={(e) => {
                    const newCounts = [...countList];
                    newCounts[index] = Number(e.target.value);
                    setCountList(newCounts);
                  }}
                  style={{ width: '100%', marginBottom: '10px' }}
                  min="0"
                />
              </div>
              {categoryIdList.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryIdList(categoryIdList.filter((_, i) => i !== index));
                    setCountList(countList.filter((_, i) => i !== index));
                  }}
                  style={{ marginBottom: '10px' }}
                >
                  削除
                </button>
              )}
            </div>
          ))}

          {categoryIdList.length < 10 && (
            <button
              type="button"
              onClick={() => {
                if (categories.length === 0) return;
                setCategoryIdList([...categoryIdList, categories[0]?.id || null]);
                setCountList([...countList, 0]);
              }}
              style={{ marginBottom: '10px' }}
            >
              + 追加
            </button>
          )}

          <hr />
          <div>
            <label>反省・メモ</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', height: '100px' }}
            />
          </div>

          <button type="submit">登録</button>
        </form>
      </main>
    </div>
  );
}