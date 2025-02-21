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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // 記録一覧取得（新しいテーブル構造に対応）
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

      // データの整形
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
    <div>
      <LoggedInTaskbar />
      <main className="mx-auto max-w-5xl p-6">
        <h2 className="text-2xl font-bold">記録一覧</h2>
        <div className="mt-4 space-y-4">
          {records.length === 0 ? (
            <p className="text-gray-500">記録がありません。</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="rounded-lg border p-4 shadow-md">
                <p className="text-lg font-bold">{record.date}</p>
                <p className="text-gray-700">負荷: {record.load}</p>
                <p className="text-gray-600">{record.reflection || 'メモなし'}</p>
                <ul className="mt-2 list-disc pl-5 text-gray-800">
                  {record.training_details?.map((detail, index) => (
                    <li key={index}>
                      {detail.category_name}: {detail.count} {detail.unit}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
