import { memo } from 'react';
import type { ClockTime } from '../../types';
import { formatTimeChinese, formatTimeDigital } from '../../utils/timeMath';

interface DigitalClockProps {
  time: ClockTime;
  showChinese?: boolean;
  showDigital?: boolean;
  className?: string;
}

const DigitalClock = memo(function DigitalClock({
  time,
  showChinese = true,
  showDigital = true,
  className = '',
}: DigitalClockProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {showChinese && (
        <span className="text-3xl font-bold font-[Fredoka,sans-serif] text-hour-hand">
          {formatTimeChinese(time)}
        </span>
      )}
      {showChinese && showDigital && (
        <span className="text-xl text-text-secondary">/</span>
      )}
      {showDigital && (
        <span className="text-2xl font-bold font-[Fredoka,sans-serif] text-minute-hand">
          {formatTimeDigital(time)}
        </span>
      )}
    </div>
  );
});

export default DigitalClock;
