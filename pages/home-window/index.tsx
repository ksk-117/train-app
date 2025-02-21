// pages/home-window/index.tsx
import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import Calendar from '../../components/Calendar'; // カレンダーコンポーネントをインポート
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type TrainingRecord = {
  id: number;
  user_id: string;
  date: string; // YYYY-MM-DD
  load: number;
};

export default function ViewRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [bgImage, setBgImage] = useState('/image/wall.png'); // 背景画像の設定

  useEffect(() => {
    const checkSessionAndFetchRecords = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        return;
      }
      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      const { data: fetchedData, error: fetchError } = await supabase
        .from('training_records')
        .select('*')
        .eq('user_id', sessionData.session.user?.id);

      if (fetchError) {
        console.error('Fetch records error:', fetchError);
      } else {
        setRecords(fetchedData || []);
      }
    };

    checkSessionAndFetchRecords();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LoggedInTaskbar />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', // 背景画像のカバー
          backgroundRepeat: 'no-repeat',
        }}
      />
      <main className="relative mx-auto mt-8 w-full max-w-5xl rounded-lg p-8 shadow-lg">
        <div className="rounded-lg bg-gray-100 p-4 shadow-md">
          <h2 className="my-6 text-center text-2xl font-bold text-gray-900">練習カレンダー</h2>
          <div className="overflow-x-auto">
            <Calendar records={records} />
          </div>
        </div>
      </main>
    </div>
  );
}
