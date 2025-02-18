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

type TrainingRecord = {
  id: number;
  user_id: string;
  date: string;
  load: number;
  category_id: number;
  count: number;
  reflection: string;
};

export default function EditRecordPage() {
  const router = useRouter();
  const { id } = router.query;
  const [record, setRecord] = useState<TrainingRecord | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Record fetch error:', error);
      } else {
        setRecord(data);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');

      if (error) {
        console.error('Category fetch error:', error);
      } else {
        setCategories(data);
      }
    };

    fetchRecord();
    fetchCategories();
  }, [id]);

  const handleSave = async () => {
    if (!record) return;

    const { error } = await supabase
      .from('training_records')
      .update({
        date: record.date,
        load: record.load,
        category_id: record.category_id,
        count: record.count,
        reflection: record.reflection,
      })
      .eq('id', record.id);

    if (error) {
      alert('保存中にエラーが発生しました: ' + error.message);
    } else {
      alert('記録を更新しました');
      router.push(`/view-records/${record.id}`);
    }
  };

  if (!record) return <p>データを読み込み中...</p>;

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <h2>記録編集</h2>
        <label>日付</label>
        <input
          type="date"
          value={record.date}
          onChange={(e) => setRecord({ ...record, date: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>練習負荷</label>
        <input
          type="number"
          value={record.load}
          min="1"
          max="10"
          onChange={(e) => setRecord({ ...record, load: Number(e.target.value) })}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>練習メニュー</label>
        <select
          value={record.category_id}
          onChange={(e) => setRecord({ ...record, category_id: Number(e.target.value) })}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.unit})
            </option>
          ))}
        </select>

        <label>回数</label>
        <input
          type="number"
          value={record.count}
          onChange={(e) => setRecord({ ...record, count: Number(e.target.value) })}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <label>反省・メモ</label>
        <textarea
          value={record.reflection}
          onChange={(e) => setRecord({ ...record, reflection: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <button onClick={handleSave} style={{ marginTop: '20px' }}>保存</button>
      </main>
    </div>
  );
}
