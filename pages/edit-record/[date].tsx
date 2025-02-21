// pages/edit-record/[date].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { FaPlus, FaTimes, FaEdit } from 'react-icons/fa'; // アイコンをインポート

type Category = {
  id: number;
  name: string;
  unit: string;
};

export default function EditRecordPage() {
  const router = useRouter();
  const { date } = router.query;
  const [load, setLoad] = useState<number>(1);
  const [reflection, setReflection] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIdList, setCategoryIdList] = useState<(number | null)[]>([]);
  const [countList, setCountList] = useState<number[]>([]);
  const [bgImage, setBgImage] = useState('/image/wall.png'); // 背景画像の設定

  useEffect(() => {
    if (!date) return;

    const fetchRecordAndCategories = async () => {
      // training_recordsを取得
      const { data: recordData, error: recordError } = await supabase
        .from('training_records')
        .select('*')
        .eq('date', date)
        .single();

      if (recordError) {
        console.error('Record fetch error:', recordError);
        return;
      }

      if (recordData) {
        setLoad(recordData.load);
        setReflection(recordData.reflection);

        // 記録に基づくカテゴリと回数の取得
        const newCategoryIds: (number | null)[] = [];
        const newCounts: number[] = [];
        const { data: detailsData, error: detailsError } = await supabase
          .from('training_record_details')
          .select('*')
          .eq('record_id', recordData.id);

        if (detailsError) {
          console.error('Details fetch error:', detailsError);
        } else {
          detailsData.forEach((detail) => {
            newCategoryIds.push(detail.category_id);
            newCounts.push(detail.count);
          });
          setCategoryIdList(newCategoryIds);
          setCountList(newCounts);
        }
      }

      // カテゴリ一覧を取得
      const { data: catData, error: catError } = await supabase
        .from('training_menu')
        .select('*');

      if (catError) {
        console.error('Category fetch error:', catError);
      } else {
        setCategories(catData);
      }
    };

    fetchRecordAndCategories();
  }, [date]);

  const handleSave = async () => {
    const updateData: any = {
      load,
      reflection,
    };

    // 記録詳細の更新
    for (let i = 0; i < 10; i++) {
      updateData[`category_id${i + 1}`] = categoryIdList[i] ?? null;
      updateData[`count${i + 1}`] = countList[i] ?? 0;
    }

    const { error } = await supabase
      .from('training_records')
      .update(updateData)
      .eq('date', date);

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
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`, // 背景画像を設定
          backgroundSize: 'cover', // 背景画像をカバーする
          backgroundRepeat: 'no-repeat', // 画像を繰り返さない
          height: '100vh', // 高さを画面全体に
        }}
      />
      <main className="mx-auto max-w-4xl p-8">
        <div className="relative mx-auto mt-16 w-full max-w-4xl rounded-lg bg-gray-100 p-8 shadow-lg">
          <h2 className="mb-6 flex items-center justify-center text-center text-2xl font-bold text-black">
            <FaEdit className="mr-2 text-gray-700" /> {/* アイコン追加 */}
            記録編集
          </h2>
  
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">日付</label>
              <input
                type="date"
                value={date}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">練習負荷</label>
              <input
              type="range"
              min="0"
              max="10"
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full accent-orange-500"
              />
              <div className="text-center text-gray-700">{load}</div>
            </div>
  
            <hr />
  
            {categoryIdList.map((categoryId, index) => (
              <div key={index} className="relative mb-4 rounded border p-4 shadow-sm">
                {/* 削除ボタン */}
                <button
                  type="button"
                  onClick={() => {
                    setCategoryIdList(categoryIdList.filter((_, i) => i !== index));
                    setCountList(countList.filter((_, i) => i !== index));
                  }}
                  className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
  
                <h4 className="mb-2 font-medium">メニュー {index + 1}</h4>
  
                <div className="flex gap-4">
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-700">練習メニュー</label>
                    <select
                      value={categoryId ?? ''}
                      onChange={(e) => {
                        const newCategoryIds = [...categoryIdList];
                        newCategoryIds[index] = e.target.value ? Number(e.target.value) : null;
                        setCategoryIdList(newCategoryIds);
                      }}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                      <option value="">選択してください</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.unit})
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">回数</label>
                    <input
                      type="number"
                      value={countList[index]}
                      onChange={(e) => {
                        const newCounts = [...countList];
                        newCounts[index] = Number(e.target.value);
                        setCountList(newCounts);
                      }}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
  
            <button
              type="button"
              onClick={() => setCategoryIdList([...categoryIdList, categories[0]?.id || null])}
              className="mb-4 flex items-center gap-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              <FaPlus /> メニューを追加
            </button>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">反省・メモ</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                rows={3}
              />
            </div>
  
            <button type="submit" className="w-full rounded-md bg-blue-500 px-6 py-3 text-lg font-bold text-white shadow-md hover:bg-blue-600">
              記録を保存
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
