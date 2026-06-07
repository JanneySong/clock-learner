import { useState, useCallback, useEffect, useRef } from 'react';
import AnalogClock from '../components/clock/AnalogClock';
import Button from '../components/ui/Button';
import type { ClockTime } from '../types';
import { formatTimeChinese, formatTimeDigital } from '../utils/timeMath';

type SpeedMode = 'normal' | 'slow' | 'super-slow';

const speedValues: Record<SpeedMode, { label: string; msPerMinute: number }> = {
  normal: { label: '正常', msPerMinute: 100 },
  slow: { label: '慢速', msPerMinute: 500 },
  'super-slow': { label: '超慢', msPerMinute: 2000 },
};

export default function ExplorePage() {
  const [time, setTime] = useState<ClockTime>({ hour: 12, minute: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedMode>('slow');
  const animationRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  const handleTimeChange = useCallback((newTime: ClockTime) => {
    setTime(newTime);
  }, []);

  const handleReset = useCallback(() => {
    setTime({ hour: 12, minute: 0 });
    setIsPlaying(false);
  }, []);

  // 动画循环
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const msPerMinute = speedValues[speed].msPerMinute;

    const animate = (timestamp: number) => {
      if (lastTickRef.current === 0) {
        lastTickRef.current = timestamp;
      }

      const elapsed = timestamp - lastTickRef.current;
      if (elapsed >= msPerMinute) {
        const minutesPassed = Math.floor(elapsed / msPerMinute);
        lastTickRef.current = timestamp - (elapsed % msPerMinute);

        setTime((prev: ClockTime) => {
          let newMinute = prev.minute + minutesPassed;
          let newHour = prev.hour;
          while (newMinute >= 60) {
            newMinute -= 60;
            newHour++;
          }
          while (newHour > 12) {
            newHour -= 12;
          }
          return { hour: newHour || 12, minute: newMinute };
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    lastTickRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col items-center gap-4 py-4 px-4">
      {/* 标题 */}
      <h2 className="text-2xl font-bold text-text-primary">🔍 自由探索</h2>
      <p className="text-base text-text-secondary">
        拖动指针或按下播放，探索时间的变化！
      </p>

      {/* 时钟 */}
      <div className="flex justify-center">
        <AnalogClock
          time={time}
          draggable={!isPlaying}
          showNumbers
          showAllNumbers
          onTimeChange={handleTimeChange}
        />
      </div>

      {/* 数字时间 */}
      <div className="bg-white rounded-2xl px-6 py-3 border-2 border-bg-card">
        <div className="text-center">
          <span className="text-3xl font-bold font-[Fredoka,sans-serif] text-hour-hand">
            {formatTimeChinese(time)}
          </span>
          <span className="text-xl text-text-secondary mx-2">/</span>
          <span className="text-2xl font-bold font-[Fredoka,sans-serif] text-minute-hand">
            {formatTimeDigital(time)}
          </span>
        </div>
      </div>

      {/* 播放控制 */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[300px]">
        {/* 播放/暂停 */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant={isPlaying ? 'secondary' : 'primary'}
            size="lg"
            icon={isPlaying ? '⏸' : '▶'}
          >
            {isPlaying ? '暂停' : '播放'}
          </Button>
          <Button
            onClick={handleReset}
            variant="ghost"
            size="lg"
            icon="🔄"
          >
            重置
          </Button>
        </div>

        {/* 速度选择 */}
        <div className="flex gap-2">
          {(Object.entries(speedValues) as [SpeedMode, typeof speedValues[SpeedMode]][]).map(
            ([key, value]) => (
              <button
                key={key}
                onClick={() => setSpeed(key)}
                className={`
                  px-4 py-2 rounded-xl text-base font-bold transition-colors btn-press
                  ${speed === key
                    ? 'bg-accent text-white'
                    : 'bg-bg-card text-text-secondary'}
                `}
              >
                {value.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* 小知识提示 */}
      <div className="bg-white rounded-2xl p-4 max-w-[400px] w-full border-2 border-bg-card">
        <p className="text-sm text-text-secondary">
          💡 小知识：分针走一圈（60分钟），时针才走一大格（1小时）。
          试试按下播放，观察时针和分针的运动关系！
        </p>
      </div>
    </div>
  );
}
