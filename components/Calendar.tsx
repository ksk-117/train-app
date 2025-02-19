// components/Calendar.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

type CalendarProps = {
  records: Array<{
    id: number; // 記録のID
    date: string;
    load: number;
  }>;
};

const Calendar: React.FC<CalendarProps> = ({ records }) => {
  const router = useRouter();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 現在の月
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // 現在の年

  // 月ごとの日数取得
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay(); // 月の最初の曜日
  
  // 負荷によって色の濃さを変更
  const getLoadColor = (load: number) => {
    const intensity = Math.min(255, 255 - load * 15);
    return `rgb(255, ${intensity}, ${intensity})`; // 赤の強弱を変える
  };

  // 日付を YYYY-MM-DD 形式にする
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // カレンダーの日付セルを作成
  const renderCalendarCells = () => {
    const cells = [];
    
    // 空白セル (月の開始曜日に合わせる)
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} style={{ width: '40px', height: '40px' }}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(currentYear, currentMonth, day);
      const record = records.find((r) => r.date === dateString);
      const load = record?.load || 0;
      const backgroundColor = load ? getLoadColor(load) : '#eee';

      cells.push(
        <div
          key={dateString}
          onClick={() => {
            if (record?.id) {
              router.push(`/edit-record/${record.id}`);
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            margin: '4px',
            textAlign: 'center',
            lineHeight: '40px',
            borderRadius: '50%',
            backgroundColor: backgroundColor,
            cursor: record ? 'pointer' : 'default',
            fontWeight: 'bold',
          }}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  return (
    <div style={{ textAlign: 'center', background: '#fff', padding: '20px', borderRadius: '10px' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {/* 曜日ヘッダー */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} style={{ fontWeight: 'bold', padding: '5px' }}>
            {day}
          </div>
        ))}
        {/* 日付を表示 */}
        {renderCalendarCells()}
      </div>

      {/* 月間の記録数を表示 */}
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        <span>月間記録日数: {records.filter((r) => r.date.startsWith(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)).length} 日</span>
      </div>
    </div>
  );
};

export default Calendar;