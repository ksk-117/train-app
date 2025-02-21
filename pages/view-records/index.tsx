// pages/view-records/index.tsx
import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type TrainingDetail = {
  category_name: string;
  count: number;
  unit: string;
};

type TrainingRecord = {
  id: number;
  date: string;
  load: number;
  reflection: string;
  training_details?: TrainingDetail[];
};

export default function ViewRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session Error: ", sessionError);
        router.push('/login');
        return;
      }
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('training_records')
        .select(`
          id, date, load, reflection,
          training_record_details (category_id, count),
          training_menu!inner(id, name, unit)
        `)
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        return;
      }

      console.log("Fetched Data: ", data); // データを確認
      const formattedRecords: TrainingRecord[] = data.map((record: any) => ({
        ...record,
        training_details: record.training_record_details.map((detail: any, index: number) => ({
          category_name: record.training_menu[index]?.name || '不明',
          count: detail.count,
          unit: record.training_menu[index]?.unit || '',
        })),
      }));

      setRecords(formattedRecords);
    };

    fetchRecords();
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <LoggedInTaskbar />
      <main className="mx-auto mt-8 max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">記録一覧</h2>

        {/* No records message */}
        {records.length === 0 ? (
          <p className="text-center text-gray-500">記録がありません。</p>
        ) : (
          // Displaying records
          <div className="space-y-6">
            {records.map((record) => (
              <div key={record.id} className="rounded-lg bg-white p-6 shadow-md">
                <p className="text-xl font-semibold text-gray-800">{record.date}</p>
                <p className="text-gray-700">負荷: {record.load}</p>
                <p className="mt-2 text-gray-600">{record.reflection || 'メモなし'}</p>

                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {record.training_details?.map((detail, index) => (
                    <li key={index} className="text-gray-800">
                      {detail.category_name}: {detail.count} {detail.unit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
