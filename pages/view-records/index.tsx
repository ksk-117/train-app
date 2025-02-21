// pages/view-records/index.tsx

import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type TrainingRecord = {
  id: number;
  date: string; // YYYY-MM-DD
  load: number;
  reflection: string;
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
        .select('id, date, load, reflection')
        .eq('user_id', session.user?.id)
        .order('date', { ascending: false }); // 新しい順に並べる

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
      <main className="mx-auto max-w-5xl p-6">
        <h2 className="text-2xl font-bold">記録一覧</h2>
        <div className="mt-4 space-y-4">
          {records.length === 0 ? (
            <p className="text-gray-500">記録がありません。</p>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border p-4 shadow-md transition hover:bg-gray-100"
                onClick={() => router.push(`/view-records/${record.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <p className="text-lg font-bold">{record.date}</p>
                <p className="text-gray-700">負荷: {record.load}</p>
                <p className="line-clamp-1 text-gray-600">{record.reflection || 'メモなし'}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
