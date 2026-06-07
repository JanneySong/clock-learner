import { useState, useCallback } from 'react';
import AnalogClock from '../clock/AnalogClock';
import Button from '../ui/Button';
import FeedbackOverlay from './FeedbackOverlay';
import type { Exercise, FeedbackType, ClockTime } from '../../types';
import { isTimeEqual, formatTimeChinese } from '../../utils/timeMath';
import { playCorrectSound, playWrongSound } from '../../utils/soundGenerator';

interface SetTimePracticeProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
  soundEnabled: boolean;
}

export default function SetTimePractice({
  exercise,
  onComplete,
  soundEnabled,
}: SetTimePracticeProps) {
  const targetTime = exercise.targetTime || { hour: 12, minute: 0 };
  const [currentTime, setCurrentTime] = useState<ClockTime>({ hour: 12, minute: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [wrongCount, setWrongCount] = useState(0);

  const handleTimeChange = useCallback((time: ClockTime) => {
    setCurrentTime(time);
  }, []);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);

    // 半时允许容差15分钟（时针位置判断困难）
    const tolerance = targetTime.minute === 30 ? 15 : 0;
    const correct = isTimeEqual(currentTime, targetTime, tolerance);

    if (correct) {
      if (soundEnabled) playCorrectSound();
      setFeedback('correct');
      setFeedbackMessage('太棒了！拨对了！');
      setTimeout(() => {
        setFeedback(null);
        onComplete(true);
      }, 1500);
    } else {
      if (soundEnabled) playWrongSound();
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);

      if (newWrongCount >= 3) {
        setFeedback('wrong');
        setFeedbackMessage(`正确时间是 ${formatTimeChinese(targetTime)}`);
        setTimeout(() => {
          setFeedback(null);
          onComplete(false);
        }, 2000);
      } else {
        setFeedback('encourage');
        setFeedbackMessage(`再试试看！${exercise.hint}`);
        setTimeout(() => {
          setFeedback(null);
          setSubmitted(false);
        }, 2000);
      }
    }
  }, [submitted, currentTime, targetTime, soundEnabled, wrongCount, exercise.hint, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      {/* 题目 */}
      <p className="text-2xl font-bold text-text-primary">{exercise.question}</p>

      {/* 目标时间 */}
      <div className="bg-white rounded-2xl px-6 py-3 border-3 border-accent">
        <span className="text-3xl font-bold font-[Fredoka,sans-serif] text-accent">
          {formatTimeChinese(targetTime)}
        </span>
      </div>

      {/* 可拖拽时钟 */}
      <div className="flex justify-center">
        <AnalogClock
          time={currentTime}
          draggable={!submitted}
          showNumbers
          showAllNumbers
          onTimeChange={handleTimeChange}
        />
      </div>

      {/* 确认按钮 */}
      <Button
        onClick={handleSubmit}
        disabled={submitted}
        size="lg"
        icon="✓"
      >
        确认
      </Button>

      {/* 反馈浮层 */}
      <FeedbackOverlay
        type={feedback}
        message={feedbackMessage}
        onDismiss={() => setFeedback(null)}
      />
    </div>
  );
}
