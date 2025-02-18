// pages/settings/index.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';

type Category = {
  id: number;
  name: string;
  unit: string; // ← 単位
};

export default function SettingsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // フォーム入力用ステート
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryUnit, setNewCategoryUnit] = useState('');

  useEffect(() => {
    // セッションをチェックし、カテゴリ一覧を取得
    const checkSessionAndFetchCategories = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        return;
      }

      // 未ログインであれば /login へリダイレクト
      if (!session) {
        router.push('/login');
        return;
      }

      // カテゴリ一覧を取得
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');

      if (catError) {
        console.error('Fetch categories error:', catError);
      } else if (catData) {
        setCategories(catData);
      }
    };

    checkSessionAndFetchCategories();
  }, [router]);

  // カテゴリ追加
  const handleAddCategory = async () => {
    if (!newCategoryName) return; // 名称が空欄ならreturn

    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        name: newCategoryName,
        unit: newCategoryUnit, // 単位を一緒にINSERT
      }]);

    if (error) {
      alert(error.message);
      return;
    }

    // 成功時はステートを更新し、新しいカテゴリを表示
    if (data) {
      setCategories((prev) => [...prev, ...data]);
    }
    // 入力欄をリセット
    setNewCategoryName('');
    setNewCategoryUnit('');
  };

  // カテゴリ削除
  const handleDeleteCategory = async (id: number) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    // 成功時はローカルのステートから削除したカテゴリを除外
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px' }}>
        <h2>練習メニュー編集</h2>

        <div>
          <h3>〇メニュー名(単位)</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '200px',
                }}
              >
                <span>
                  {category.name}
                  {category.unit ? `(${category.unit})` : ''}
                </span>
                <button onClick={() => handleDeleteCategory(category.id)}>削除</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>カテゴリ追加</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>メニュー名：</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="例: 腹筋"
              style={{ marginRight: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>単位：　　　</label>
            <input
              type="text"
              value={newCategoryUnit}
              onChange={(e) => setNewCategoryUnit(e.target.value)}
              placeholder="例: 回, km"
              style={{ marginRight: '10px' }}
            />
          </div>
          <button onClick={handleAddCategory}>追加</button>
        </div>
      </main>
    </div>
  );
}
