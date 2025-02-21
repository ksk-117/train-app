// components/Calendar.tsx
// このコンポーネントは、指定された練習記録（records）を基にカレンダーを表示します。
// 各日付セルは、該当日の練習記録がある場合、loadの値に応じて背景色を変えます。
// データのない日付はクリックできないように設定し、カーソルも変更します。
// ※ 日付のフォーマットが "YYYY-MM-DD" 以外の場合（例："YYYY-MM-DDT00:00:00.000Z"）、先頭10文字で比較します。
import React, { useState } from 'react';
import { useRouter } from 'next/router';

type CalendarProps = {
  records: Array<{
    id: number;
    date: string;
    load: number;
  }>;
};

const Calendar: React.FC<CalendarProps> = ({ records }) => {
  const router = useRouter();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // 月ごとの日数を取得する関数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  // 負荷によって色の濃さを変更する関数（負荷が大きいほど背景が赤くなる）
  const getLoadColor = (load: number) => {
    const intensity = Math.min(255, 255 - load * 15);
    return `rgb(255, ${intensity}, ${intensity})`;
  };

  // 日付を "YYYY-MM-DD" 形式にフォーマットする
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // カレンダーの日付セルを作成する
  const renderCalendarCells = () => {
    const cells = [];

    // 月初の空白セルを追加
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} style={{ width: '40px', height: '40px' }}></div>);
    }

    // 各日付セルの生成
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(currentYear, currentMonth, day);
      // 日付比較の際、records.dateがISO形式の場合、先頭10文字を使う
      const record = records.find((r) => r.date.substring(0, 10) === dateString);
      const load = record?.load || 0;
      const backgroundColor = record ? getLoadColor(load) : '#eee';
      const isClickable = Boolean(record);

      cells.push(
        <div
          key={dateString}
          onClick={isClickable ? () => router.push(`/edit-record/${dateString}`) : undefined}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            textAlign: 'center',
            lineHeight: '40px',
            borderRadius: '50%',
            backgroundColor: backgroundColor,
            cursor: isClickable ? 'pointer' : 'default',
            fontWeight: 'bold',
            margin: 'auto',
          }}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  return (
    <div
      style={{
        textAlign: 'center',
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* 月・年選択 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          style={{ fontSize: '16px' }}
        >
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={currentMonth}
          onChange={(e) => setCurrentMonth(Number(e.target.value))}
          style={{ fontSize: '16px' }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}月
            </option>
          ))}
        </select>
      </div>

      {/* カレンダー表示 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '5px',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        {/* 曜日ヘッダー */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} style={{ fontWeight: 'bold', padding: '5px' }}>
            {day}
          </div>
        ))}
        {/* 日付セル */}
        {renderCalendarCells()}
      </div>

      {/* 月間記録日数の表示 */}
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        <span>
          月間記録日数:{' '}
          {records.filter((r) =>
            r.date.substring(0, 7) === `${currentYear}-${String(currentMonth).padStart(2, '0')}`
          ).length}{' '}
          日
        </span>
      </div>
    </div>
  );
};

export default Calendar;
