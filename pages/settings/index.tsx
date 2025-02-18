// pages/settings/index.tsx

import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type Category = {
  id: number;
  name: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    // セッションを確認する関数
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }
      if (!session) {
        // セッションがなければログインページへ
        router.push('/login');
      }
    };

    // カテゴリ一覧を取得する関数
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (data && !error) {
        setCategories(data);
      }
    };

    // 上記2つの処理を順番に実行
    checkSession();
    fetchCategories();
  }, [router]);

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName }]);
    if (error) {
      alert(error.message);
    } else {
      setCategories((prev) => [...prev, ...(data || [])]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      alert(error.message);
    } else {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px' }}>
        <h2>設定 - カテゴリ編集</h2>
        <div>
          <h3>現在のカテゴリ</h3>
          <ul>
            {categories.map((cat) => (
              <li
                key={cat.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '200px',
                }}
              >
                <span>{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat.id)}>削除</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>カテゴリ追加</h3>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="例: ノック"
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleAddCategory}>追加</button>
        </div>
      </main>
    </div>
  );
}
