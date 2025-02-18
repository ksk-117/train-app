// components/Calendar.tsx
/**
 * シンプルなカレンダーコンポーネントの例
 */

import React from 'react';

type CalendarProps = {
  // 例: YYYY-MM-DD形式の日付と、その負荷や内容などを表す構造体
  records: Array<{
    date: string;
    load: number;
  }>;
  onSelectDate?: (date: string) => void;
};

const Calendar: React.FC<CalendarProps> = ({ records, onSelectDate }) => {
  // カレンダーを描画する日数（サンプル用に30日分）
  const daysInMonth = 30;

  // recordsから「date: '2023-01-01', load: 5」などをもとに
  // カレンダーセルを生成するサンプル
  const renderCalendarCells = () => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateString = `2023-01-${String(day).padStart(2, '0')}`;

      // 該当日付のレコードを探す (複数なら合計するなど拡張可)
      const record = records.find((r) => r.date === dateString);
      const load = record?.load || 0;

      return (
        <div
          key={dateString}
          onClick={() => {
            onSelectDate?.(dateString);
          }}
          style={{
            width: '30px',
            height: '30px',
            margin: '2px',
            textAlign: 'center',
            lineHeight: '30px',
            backgroundColor: load > 5 ? '#ff9999' : '#fff',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          {day}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '210px',
      }}
    >
      {renderCalendarCells()}
    </div>
  );
};

export default Calendar;
