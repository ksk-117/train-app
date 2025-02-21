// pages/home-window/index.tsx


import React, { useEffect, useState } from 'react';
import LoggedInTaskbar from '../../components/Layout/LoggedInTaskbar';
import Calendar from '../../components/Calendar';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

type TrainingRecord = {
  id: number;
  user_id: string;
  date: string; // YYYY-MM-DD
  load: number;
};

type MaxMonthlyRankingItem = { 
  userId: string; 
  maxSessions: number; 
};

type PersonalMonthlyRankingItem = {
  month: string;
  sessions: number;
};

type GlobalSessionsRankingItem = {
  userId: string;
  totalSessions: number;
};

type GlobalLoadRankingItem = {
  userId: string;
  totalLoad: number;
};

type PersonalMenuStats = {
  mostPerformedMenu: string | null;
  mostRepeatedMenu: string | null;
};

export default function ViewRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  
  // 個人統計情報
  const [personalMonthlyRanking, setPersonalMonthlyRanking] = useState<PersonalMonthlyRankingItem[]>([]);
  const [personalMenuStats, setPersonalMenuStats] = useState<PersonalMenuStats | null>(null);

  // 全ユーザー統計情報
  const [globalMaxRanking, setGlobalMaxRanking] = useState<MaxMonthlyRankingItem[]>([]);
  const [globalSessionsRanking, setGlobalSessionsRanking] = useState<GlobalSessionsRankingItem[]>([]);
  const [globalLoadRanking, setGlobalLoadRanking] = useState<GlobalLoadRankingItem[]>([]);

  // 背景画像とローディング状態
  const [bgImage, setBgImage] = useState('/image/wall.png');
  const [loadingGlobalMax, setLoadingGlobalMax] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingGlobalSessions, setLoadingGlobalSessions] = useState(false);
  const [loadingGlobalLoad, setLoadingGlobalLoad] = useState(false);
  const [loadingPersonalMenuStats, setLoadingPersonalMenuStats] = useState(false);

  // ユーザーID表示用のフォーマット関数：5文字以上の場合は先頭5文字＋"…"に変換
  const formatUserId = (userId: string): string => {
    return userId.length > 5 ? userId.substring(0, 5) + "…" : userId;
  };

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      // セッションチェック
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        return;
      }
      if (!sessionData.session) {
        router.push('/login');
        return;
      }
      const userId = sessionData.session.user?.id;
      if (!userId) {
        console.error('User ID not found.');
        return;
      }

      // 【個人】練習記録の取得
      const { data: fetchedRecords, error: recordsError } = await supabase
        .from('training_records')
        .select('*')
        .eq('user_id', userId);
      if (recordsError) {
        console.error('Fetch records error:', recordsError);
      } else {
        setRecords(fetchedRecords || []);
      }

      // 【全ユーザー】最大月間練習回数ランキングの取得
      setLoadingGlobalMax(true);
      const { data: globalMaxData, error: globalMaxError } = await supabase.rpc('get_max_monthly_training_ranking');
      if (globalMaxError) {
        console.error('Global max ranking fetch error:', globalMaxError);
      } else {
        setGlobalMaxRanking(globalMaxData || []);
      }
      setLoadingGlobalMax(false);

      // 【個人】今までの月間練習回数ランキングの取得
      setLoadingPersonal(true);
      const { data: personalMonthlyData, error: personalMonthlyError } = await supabase.rpc('get_personal_monthly_training_ranking', { p_user_id: userId });
      if (personalMonthlyError) {
        console.error('Personal monthly ranking fetch error:', personalMonthlyError);
      } else {
        setPersonalMonthlyRanking(personalMonthlyData || []);
      }
      setLoadingPersonal(false);

      // 【全ユーザー】総練習回数ランキングの取得
      setLoadingGlobalSessions(true);
      const { data: globalSessionsData, error: globalSessionsError } = await supabase.rpc('get_global_total_sessions_ranking');
      if (globalSessionsError) {
        console.error('Global total sessions ranking fetch error:', globalSessionsError);
      } else {
        setGlobalSessionsRanking(globalSessionsData || []);
      }
      setLoadingGlobalSessions(false);

      // 【全ユーザー】総負荷ランキングの取得
      setLoadingGlobalLoad(true);
      const { data: globalLoadData, error: globalLoadError } = await supabase.rpc('get_global_total_load_ranking');
      if (globalLoadError) {
        console.error('Global total load ranking fetch error:', globalLoadError);
      } else {
        setGlobalLoadRanking(globalLoadData || []);
      }
      setLoadingGlobalLoad(false);

      // 【個人】練習メニュー統計（最も実施したメニュー、最も回数が多いメニュー）の取得
      setLoadingPersonalMenuStats(true);
      const { data: personalMenuStatsData, error: personalMenuStatsError } = await supabase.rpc('get_personal_menu_statistics', { p_user_id: userId });
      if (personalMenuStatsError) {
        console.error('Personal menu statistics fetch error:', personalMenuStatsError);
      } else {
        setPersonalMenuStats(personalMenuStatsData || null);
      }
      setLoadingPersonalMenuStats(false);
    };

    checkSessionAndFetchData();
  }, [router]);

  // 個人統計のサマリー計算（自分の練習記録から）
  const totalSessions = records.length;
  const totalLoad = records.reduce((acc, record) => acc + record.load, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LoggedInTaskbar />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <main className="relative mx-auto mt-8 w-full max-w-5xl space-y-8 rounded-lg p-8 shadow-lg">
        {/* 練習カレンダー */}
        <div className="rounded-lg bg-gray-100 p-4 shadow-md">
          <h2 className="my-6 text-center text-2xl font-bold text-gray-900">練習カレンダー</h2>
          <div className="overflow-x-auto">
            <Calendar records={records} />
          </div>
        </div>

        {/* 個人統計情報（サマリーと個人ランキング・メニュー統計を統合） */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">📝個人統計情報</h2>
          <div className="space-y-2">
            <p className="text-lg">総練習回数: <span className="font-semibold">{totalSessions}回</span></p>
            <p className="text-lg">総負荷: <span className="font-semibold">{totalLoad}</span></p>
          </div>
          <div className="mt-4">
            <h3 className="mb-2 text-xl font-semibold">月間練習回数ランキング</h3>
            {loadingPersonal ? (
              <p>ランキングを読み込み中...</p>
            ) : personalMonthlyRanking.length > 0 ? (
              personalMonthlyRanking.map((item, index) => (
                <p key={item.month} className="text-lg">
                  {index + 1}位: <span className="font-semibold">{item.month}</span> (練習回数: {item.sessions}回)
                </p>
              ))
            ) : (
              <p className="text-gray-600">データなし</p>
            )}
          </div>
          <div className="mt-4">
            <h3 className="mb-2 text-xl font-semibold">練習メニュー統計</h3>
            {loadingPersonalMenuStats ? (
              <p>統計を読み込み中...</p>
            ) : personalMenuStats ? (
              <>
                <p className="text-lg">最も実施したメニュー: <span className="font-semibold">{personalMenuStats.mostPerformedMenu || 'なし'}</span></p>
                <p className="text-lg">最も回数が多いメニュー: <span className="font-semibold">{personalMenuStats.mostRepeatedMenu || 'なし'}</span></p>
              </>
            ) : (
              <p className="text-gray-600">データなし</p>
            )}
          </div>
        </div>

        {/* 全ユーザー統計情報 */}
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">🏆全ユーザー統計情報</h2>
          <div>
            <h3 className="mb-2 text-xl font-semibold">最大月間練習回数ランキング</h3>
            {loadingGlobalMax ? (
              <p>ランキングを読み込み中...</p>
            ) : globalMaxRanking.length > 0 ? (
              globalMaxRanking.map((item, index) => (
                <p key={item.userId} className="text-lg">
                  {index + 1}位: <span className="font-semibold">{formatUserId(item.userId)}</span> (最大月間練習回数: {item.maxSessions}回)
                </p>
              ))
            ) : (
              <p className="text-gray-600">データなし</p>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">総練習回数ランキング</h3>
            {loadingGlobalSessions ? (
              <p>ランキングを読み込み中...</p>
            ) : globalSessionsRanking.length > 0 ? (
              globalSessionsRanking.map((item, index) => (
                <p key={item.userId} className="text-lg">
                  {index + 1}位: <span className="font-semibold">{formatUserId(item.userId)}</span> (総練習回数: {item.totalSessions}回)
                </p>
              ))
            ) : (
              <p className="text-gray-600">データなし</p>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">総負荷ランキング</h3>
            {loadingGlobalLoad ? (
              <p>ランキングを読み込み中...</p>
            ) : globalLoadRanking.length > 0 ? (
              globalLoadRanking.map((item, index) => (
                <p key={item.userId} className="text-lg">
                  {index + 1}位: <span className="font-semibold">{formatUserId(item.userId)}</span> (総負荷: {item.totalLoad})
                </p>
              ))
            ) : (
              <p className="text-gray-600">データなし</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
