import { memo } from 'react';

interface ClockHandProps {
  angle: number;
  type: 'hour' | 'minute';
  isDragging?: boolean;
  onPointerDown?: (e: React.PointerEvent<SVGGElement>) => void;
}

const ClockHand = memo(function ClockHand({
  angle,
  type,
  isDragging = false,
  onPointerDown,
}: ClockHandProps) {
  const isHour = type === 'hour';
  const length = isHour ? 48 : 68;
  const width = isHour ? 8 : 4;
  const color = isHour ? '#2C3E50' : '#FF7043';
  const tailLength = isHour ? 14 : 18;

  // 不可见的触控热区（扩大点击区域）
  const hitAreaSize = 28;

  return (
    <g
      className={isDragging ? 'clock-hand-dragging' : 'clock-hand-transition'}
      style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: '100px 100px',
        cursor: isDragging ? 'grabbing' : onPointerDown ? 'grab' : 'default',
      }}
      onPointerDown={onPointerDown}
    >
      {/* 指针尾部 */}
      <line
        x1="100"
        y1={100 + tailLength}
        x2="100"
        y2="100"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* 指针主体 */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2={100 - length}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* 不可见触控热区 */}
      {onPointerDown && (
        <line
          x1="100"
          y1={100 + tailLength}
          x2="100"
          y2={100 - length}
          stroke="transparent"
          strokeWidth={hitAreaSize}
          strokeLinecap="round"
        />
      )}
    </g>
  );
});

export default ClockHand;
