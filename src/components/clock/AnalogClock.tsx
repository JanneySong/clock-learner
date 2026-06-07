import { memo, useCallback, useRef, useState } from 'react';
import ClockFace from './ClockFace';
import ClockHand from './ClockHand';
import { timeToAngle, calculateAngleFromCenter, snapToNearestMark } from '../../utils/timeMath';
import type { ClockTime } from '../../types';

interface AnalogClockProps {
  time: ClockTime;
  draggable?: boolean;
  showNumbers?: boolean;
  showAllNumbers?: boolean;
  onTimeChange?: (time: ClockTime) => void;
  highlightNumber?: number;
  className?: string;
}

function AnalogClock({
  time,
  draggable = false,
  showNumbers = true,
  showAllNumbers = true,
  onTimeChange,
  highlightNumber,
  className = '',
}: AnalogClockProps) {
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { hourAngle, minuteAngle } = timeToAngle(time.hour, time.minute);

  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 100, y: 100 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 200 / rect.width;
    const scaleY = 200 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handlePointerDown = useCallback(
    (hand: 'hour' | 'minute') => (e: React.PointerEvent<SVGGElement>) => {
      if (!draggable) return;
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      setDragging(hand);
    },
    [draggable]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (!dragging || !onTimeChange) return;
      e.preventDefault();
      const point = getSvgPoint(e.clientX, e.clientY);
      const angle = calculateAngleFromCenter(100, 100, point.x, point.y);

      if (dragging === 'minute') {
        const snappedAngle = snapToNearestMark(angle, 5);
        const newMinute = Math.round(snappedAngle / 6) % 60;
        // 时针联动
        const newHourAngle = (time.hour % 12) * 30 + newMinute * 0.5;
        const newHour = Math.round(newHourAngle / 30) % 12 || 12;
        onTimeChange({ hour: newHour, minute: newMinute });
      } else {
        const snappedAngle = snapToNearestMark(angle, 30);
        const newHour = Math.round(snappedAngle / 30) % 12 || 12;
        onTimeChange({ hour: newHour, minute: time.minute });
      }
    },
    [dragging, onTimeChange, getSvgPoint, time]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className={`w-full h-full max-w-[min(80vw,400px)] max-h-[min(80vw,400px)] ${className}`}
      style={{ touchAction: draggable ? 'none' : 'auto' }}
      onPointerMove={dragging ? handlePointerMove : undefined}
      onPointerUp={dragging ? handlePointerUp : undefined}
      onPointerCancel={dragging ? handlePointerUp : undefined}
      role="img"
      aria-label={`时钟显示${time.hour}时${time.minute}分`}
    >
      <title>{`时钟显示${time.hour}时${time.minute}分`}</title>

      {/* 表盘 */}
      <ClockFace
        showNumbers={showNumbers}
        showAllNumbers={showAllNumbers}
        highlightNumber={highlightNumber}
      />

      {/* 时针 */}
      <ClockHand
        angle={hourAngle}
        type="hour"
        isDragging={dragging === 'hour'}
        onPointerDown={draggable ? handlePointerDown('hour') : undefined}
      />

      {/* 分针 */}
      <ClockHand
        angle={minuteAngle}
        type="minute"
        isDragging={dragging === 'minute'}
        onPointerDown={draggable ? handlePointerDown('minute') : undefined}
      />

      {/* 中心圆点 */}
      <circle cx="100" cy="100" r={6} fill="#2C3E50" />
      <circle cx="100" cy="100" r={3} fill="#FF7043" />
    </svg>
  );
}

export default memo(AnalogClock);
