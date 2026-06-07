import { memo } from 'react';

interface ClockFaceProps {
  size?: number;
  showNumbers?: boolean;
  showAllNumbers?: boolean;
  highlightNumber?: number;
}

// 12个小时标记的位置
const HOUR_MARKS = [
  { hour: 12, angle: 0 },
  { hour: 1, angle: 30 },
  { hour: 2, angle: 60 },
  { hour: 3, angle: 90 },
  { hour: 4, angle: 120 },
  { hour: 5, angle: 150 },
  { hour: 6, angle: 180 },
  { hour: 7, angle: 210 },
  { hour: 8, angle: 240 },
  { hour: 9, angle: 270 },
  { hour: 10, angle: 300 },
  { hour: 11, angle: 330 },
];

const ClockFace = memo(function ClockFace({
  showNumbers = true,
  showAllNumbers = true,
  highlightNumber,
}: ClockFaceProps) {
  // 刻度线
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6;
    const isHour = i % 5 === 0;
    const outerR = 90;
    const innerR = isHour ? 80 : 85;
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = 100 + outerR * Math.cos(rad);
    const y1 = 100 + outerR * Math.sin(rad);
    const x2 = 100 + innerR * Math.cos(rad);
    const y2 = 100 + innerR * Math.sin(rad);
    return (
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isHour ? '#555' : '#ccc'}
        strokeWidth={isHour ? 2.5 : 0.8}
        strokeLinecap="round"
      />
    );
  });

  // 数字
  const numbers = showNumbers
    ? HOUR_MARKS.filter(m => showAllNumbers || [12, 3, 6, 9].includes(m.hour)).map(m => {
        const rad = (m.angle - 90) * (Math.PI / 180);
        const r = 70;
        const x = 100 + r * Math.cos(rad);
        const y = 100 + r * Math.sin(rad);
        const isHighlighted = highlightNumber === m.hour;
        return (
          <text
            key={`num-${m.hour}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-[#333] font-[Fredoka,sans-serif]"
            fontSize={showAllNumbers ? 16 : 18}
            fontWeight={600}
            style={{
              fill: isHighlighted ? '#FF9800' : '#333',
              fontSize: isHighlighted ? 20 : undefined,
            }}
          >
            {m.hour}
          </text>
        );
      })
    : null;

  return (
    <g>
      {/* 表盘背景 */}
      <circle cx="100" cy="100" r="96" fill="white" stroke="#E0D5C1" strokeWidth={3} />
      <circle cx="100" cy="100" r="93" fill="white" />

      {/* 刻度线 */}
      {ticks}

      {/* 数字 */}
      {numbers}
    </g>
  );
});

export default ClockFace;
