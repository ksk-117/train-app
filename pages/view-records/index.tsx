// pages/view-records/index.tsx
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

  useEffect(() => {
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
        router.push('/login');
        return;
      }

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

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px' }}>
        <h2>記録閲覧</h2>
        <Calendar records={records} />
      </main>
    </div>
  );
}
