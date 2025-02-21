// pages/edit-menu/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { FaTimes, FaPlus } from 'react-icons/fa';

type TrainingMenu = {
  id: number;
  name: string;
  unit: string; // 単位
};

export default function SettingsPage() {
  const router = useRouter();
  const [trainingMenus, setTrainingMenus] = useState<TrainingMenu[]>([]);

  // フォーム入力用ステート
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuUnit, setNewMenuUnit] = useState('');
  const [bgImage, setBgImage] = useState('/image/wall.png');

  useEffect(() => {
    const checkSessionAndFetchMenus = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        return;
      }
      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      // training_menu一覧を取得
      const { data: menuData, error: menuError } = await supabase
        .from('training_menu')
        .select('*');

      if (menuError) {
        console.error('Fetch menus error:', menuError);
      } else if (menuData) {
        setTrainingMenus(menuData);
      }
    };

    checkSessionAndFetchMenus();
  }, [router]);

  // メニュー追加
  const handleAddMenu = async () => {
    if (!newMenuName) return; // 名称が空欄ならreturn

    const { data, error } = await supabase
      .from('training_menu')
      .insert([{
        name: newMenuName,
        unit: newMenuUnit, // 単位を一緒にINSERT
      }]);

    if (error) {
      alert(error.message);
      return;
    }

    // 成功時はステートを更新し、新しいメニューを表示
    if (data) {
      setTrainingMenus((prev) => [...prev, ...data]);
    }
    // 入力欄をリセット
    setNewMenuName('');
    setNewMenuUnit('');
  };

  // メニュー削除
  const handleDeleteMenu = async (id: number) => {
    const { error } = await supabase
      .from('training_menu')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    // 成功時はローカルのステートから削除したメニューを除外
    setTrainingMenus((prev) => prev.filter((menu) => menu.id !== id));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LoggedInTaskbar />
      <div
        className="absolute inset-0 -z-10 size-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover", // 画面全体に表示
          backgroundRepeat: "no-repeat",
        }}
      />
      <main className="mx-auto max-w-4xl p-8">
        <div className="relative mx-auto mt-16 w-full max-w-4xl rounded-lg bg-gray-100 p-8 shadow-lg"> 
          <h2 className="mb-8 text-center text-2xl font-bold text-black">練習メニュー管理</h2>
  
          {/* メニュー表示エリア */}
          <div className="mb-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainingMenus.map((menu) => (
              <div key={menu.id} className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{menu.name}</h3>
                  {menu.unit && <p className="text-sm text-gray-600">単位: {menu.unit}</p>}
                </div>
                <button
                  onClick={() => handleDeleteMenu(menu.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <FaTimes className="size-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8"></div>

        {/* メニュー追加フォーム */}
        <div className="rounded-lg bg-gray-100 p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-2xl font-semibold">
            <FaPlus className="mr-2" /> 新しい練習メニューを追加
          </h3>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">メニュー名</label>
            <input
              type="text"
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="例: 腹筋"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">単位</label>
            <input
              type="text"
              value={newMenuUnit}
              onChange={(e) => setNewMenuUnit(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="例: 回, kg"
            />
          </div>
          <button
            onClick={handleAddMenu}
            className="flex w-full items-center justify-center rounded-md bg-blue-500 p-3 font-semibold text-white hover:bg-blue-600"
          >
            <FaPlus className="mr-2" /> メニューを追加
          </button>
        </div>
      </main>
    </div>
  );
}
