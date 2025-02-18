// pages/analyze-records/index.tsx

import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type RecordStats = {
  menu: string;
  maxCount: number;
};

export default function AnalyzeRecordsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<RecordStats[]>([]);

  useEffect(() => {
    // セッションの確認 & 統計取得をまとめて行う
    const checkSessionAndFetchStats = async () => {
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

      // 練習メニューごとの最大回数などの統計情報を取得する例
      // 実際にはDBテーブル構造に応じてSQL文を組み合わせる
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'get_menu_max_counts',
        { user_id_param: session.user?.id }
      );
      /**
       *  例: Supabaseの関数(get_menu_max_counts)を下記のように定義:
       *  CREATE OR REPLACE FUNCTION get_menu_max_counts(user_id_param uuid)
       *  RETURNS TABLE(menu text, "maxCount" int)
       *  LANGUAGE sql
       *  AS $$
       *    SELECT menu, MAX(count) as "maxCount"
       *    FROM training_records
       *    WHERE user_id = user_id_param
       *    GROUP BY menu;
       *  $$
       */
      if (rpcError) {
        console.error('RPC error:', rpcError);
      } else {
        setStats(rpcData || []);
      }
    };

    checkSessionAndFetchStats();
  }, [router]);

  return (
    <div>
      <LoggedInTaskbar />
      <main style={{ padding: '20px' }}>
        <h2>記録分析</h2>
        {stats.length === 0 ? (
          <p>まだデータがありません。</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>メニュー</th>
                <th>最大回数</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.menu}</td>
                  <td>{item.maxCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
