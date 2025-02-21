// pages/create-record/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaPlus, FaTimes } from 'react-icons/fa'; // アイコン
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';

type TrainingMenu = {
  id: number;
  name: string;
  unit: string;
};

export default function CreateRecordPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [load, setLoad] = useState<number>(5); // 初期値5 (スライダー)
  const [reflection, setReflection] = useState('');
  const [trainingMenu, setTrainingMenu] = useState<TrainingMenu[]>([]);
  const [menuSelections, setMenuSelections] = useState<{ category_id: number | null; count: number }[]>([
    { category_id: null, count: 0 }, // 初期値を0に変更
  ]);
  const [bgImage, setBgImage] = useState('/image/wall.png');

  useEffect(() => {
    const checkSessionAndFetchMenu = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session fetch error:', error);
        return;
      }
      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      const { data: menuData } = await supabase.from('training_menu').select('*');
      if (menuData) {
        setTrainingMenu(menuData);
      }
    };
    checkSessionAndFetchMenu();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: sessionData, error } = await supabase.auth.getSession();
    if (!sessionData.session || error) {
      alert('セッションがありません。ログインしてください。');
      router.push('/login');
      return;
    }

    const userId = sessionData.session.user.id;

    // 同じ日付の記録が存在していたら削除
    const { data: existingRecords, error: fetchError } = await supabase
      .from('training_records')
      .select('id')
      .eq('user_id', userId)
      .eq('date', date);

    if (fetchError) {
      console.error('Fetch existing records error:', fetchError);
      return;
    }

    // 存在するレコードがあれば削除
    if (existingRecords.length > 0) {
      const { error: deleteError } = await supabase
        .from('training_records')
        .delete()
        .eq('id', existingRecords[0].id); // 最初のレコードを削除

      if (deleteError) {
        console.error('Delete existing record error:', deleteError);
        return;
      }
      console.log(`Deleted existing record with ID: ${existingRecords[0].id}`);
    }

    // 新しい記録を training_records テーブルに挿入
    const { data: recordData, error: recordError } = await supabase
      .from('training_records')
      .insert([{ user_id: userId, date, load, reflection }])
      .select()
      .single();

    if (recordError) {
      console.error('Insert error:', recordError);
      alert(recordError.message);
      return;
    }

    const recordId = recordData.id;

    // training_record_details に関連データを挿入
    const detailsData = menuSelections
      .filter((item) => item.category_id !== null && item.count > 0)  // category_idがnullでないもの、countが0以上のもののみ
      .map((item) => ({
        record_id: recordId,
        category_id: item.category_id!,
        count: item.count,
      }));

    if (detailsData.length > 0) {
      const { error: detailsError } = await supabase.from('training_record_details').insert(detailsData);
      if (detailsError) {
        console.error('Insert error:', detailsError);
        alert(detailsError.message);
      }
    }

    alert('記録を追加しました');
    router.push('/view-records');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LoggedInTaskbar />
      <div
        className="absolute inset-0 -z-10 size-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', // 画面全体に表示
          backgroundRepeat: 'no-repeat',
        }}
      />
      <main className="mx-auto max-w-4xl p-8">
        <div className="relative mx-auto mt-16 w-full max-w-4xl rounded-lg bg-gray-100 p-8 shadow-lg">
          <h2 className="mb-6 flex items-center justify-center text-center text-2xl font-bold text-black">
            <FaPlus className="mr-2 text-gray-700" />
            記録作成
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
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
              <p className="text-center text-gray-700">{load}</p>
            </div>

            <hr className="my-4" />

            {menuSelections.map((menu, index) => (
              <div key={index} className="relative mb-4 rounded border p-4 shadow-sm">
                {/* 削除ボタン */}
                <button
                  type="button"
                  onClick={() => setMenuSelections(menuSelections.filter((_, i) => i !== index))}
                  className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>

                <h4 className="mb-2 font-medium">メニュー {index + 1}</h4>
                <div className="flex gap-4">
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-700">練習メニュー</label>
                    <select
                      value={menu.category_id ?? ''}
                      onChange={(e) => {
                        const newMenuSelections = [...menuSelections];
                        newMenuSelections[index].category_id = e.target.value ? Number(e.target.value) : null;
                        setMenuSelections(newMenuSelections);
                      }}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                      <option value="">選択してください</option>
                      {trainingMenu.map((menu) => (
                        <option key={menu.id} value={menu.id}>
                          {menu.name} ({menu.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">回数</label>
                    <input
                      type="number"
                      value={menu.count}
                      onChange={(e) => {
                        const newMenuSelections = [...menuSelections];
                        newMenuSelections[index].count = e.target.value ? Number(e.target.value) : 0;
                        setMenuSelections(newMenuSelections);
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
              onClick={() => setMenuSelections([...menuSelections, { category_id: null, count: 0 }])}
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

            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-6 py-3 text-lg font-bold text-white shadow-md hover:bg-blue-600"
            >
              記録を保存
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
