// pages/edit-record/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';

type Category = {
  id: number;
  name: string;
  unit: string;
};

export default function EditRecordPage() {
  const router = useRouter();
  const { id } = router.query;
  const [date, setDate] = useState('');
  const [load, setLoad] = useState<number>(1);
  const [reflection, setReflection] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIdList, setCategoryIdList] = useState<(number | null)[]>([]);
  const [countList, setCountList] = useState<number[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchRecordAndCategories = async () => {
      const { data: recordData, error: recordError } = await supabase
        .from('training_records')
        .select('*')
        .eq('id', id)
        .single();

      if (recordError) {
        console.error('Record fetch error:', recordError);
        return;
      }

      if (recordData) {
        setDate(recordData.date);
        setLoad(recordData.load);
        setReflection(recordData.reflection);

        const newCategoryIds: (number | null)[] = [];
        const newCounts: number[] = [];
        for (let i = 1; i <= 10; i++) {
          if (recordData[`category_id${i}`]) {
            newCategoryIds.push(recordData[`category_id${i}`]);
            newCounts.push(recordData[`count${i}`] || 0);
          }
        }
        setCategoryIdList(newCategoryIds);
        setCountList(newCounts);
      }

      // カテゴリ一覧を取得
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');

      if (catError) {
        console.error('Category fetch error:', catError);
      } else {
        setCategories(catData);
      }
    };

    fetchRecordAndCategories();
  }, [id]);

  const handleSave = async () => {
    const updateData: any = {
      date,
      load,
      reflection,
    };

    for (let i = 0; i < 10; i++) {
      updateData[`category_id${i + 1}`] = categoryIdList[i] ?? null;
      updateData[`count${i + 1}`] = countList[i] ?? 0;
    }

    const { error } = await supabase
      .from('training_records')
      .update(updateData)
      .eq('id', id);

    if (error) {
      alert('保存中にエラーが発生しました: ' + error.message);
    } else {
      alert('記録を更新しました');
      router.push('/view-records');
    }
  };

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <h2>記録編集</h2>

        <label>日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>練習負荷 (1~10)</label>
        <input
          type="number"
          value={load}
          min="1"
          max="10"
          onChange={(e) => setLoad(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <hr />
        {categoryIdList.map((categoryId, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <h4>メニュー {index + 1}</h4>

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

            <label>回数</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="number"
                value={countList[index]}
                onChange={(e) => {
                  const newCounts = [...countList];
                  newCounts[index] = Number(e.target.value);
                  setCountList(newCounts);
                }}
                style={{ width: '80%', marginRight: '5px' }}
                min="0"
              />
              <span>{categories.find((cat) => cat.id === categoryId)?.unit || ''}</span>
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
        <label>反省・メモ</label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', height: '100px' }}
        />

        <button onClick={handleSave} style={{ marginTop: '20px' }}>保存</button>
      </main>
    </div>
  );
}
