// pages/view-records/index.tsx

import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type TrainingRecord = {
  id: number;
  user_id: string;
  date: string; // YYYY-MM-DD
  load: number;
  // 他にメニューや回数など必要に応じて
};

export default function ViewRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    // セッションチェックと記録取得をまとめて行う
    const checkSessionAndFetchRecords = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        return;
      }
      if (!session) {
        // セッションがなければログインページへ
        router.push('/login');
        return;
      }

      // 記録データをSupabaseから取得
      const { data: fetchedData, error: fetchError } = await supabase
        .from('training_records')
        .select('*')
        .eq('user_id', session.user?.id);

      if (fetchError) {
        console.error('Fetch records error:', fetchError);
      } else {
        setRecords(fetchedData || []);
      }
    };

    checkSessionAndFetchRecords();
  }, [router]);

  // カレンダー表示のロジック例
  const renderCalendar = () => {
    // シンプルに1ヶ月分だけをマスで表示する例（実際にはライブラリ推奨）
    const daysInMonth = 30; // 仮に30日とする
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '210px' }}>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateString = `2023-01-${String(day).padStart(2, '0')}`;
          const record = records.find((r) => r.date === dateString);
          const load = record?.load || 0;

          return (
            <div
              key={day}
              onClick={() => {
                if (record) {
                  // 詳細画面に遷移
                  router.push(`/view-records/${record.id}`);
                }
              }}
              style={{
                width: '30px',
                height: '30px',
                margin: '2px',
                textAlign: 'center',
                lineHeight: '30px',
                backgroundColor: load > 5 ? '#ff9999' : '#fff',
                cursor: record ? 'pointer' : 'default',
                border: '1px solid #ccc',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px' }}>
        <h2>記録閲覧</h2>
        {renderCalendar()}
      </main>
    </div>
  );
}
