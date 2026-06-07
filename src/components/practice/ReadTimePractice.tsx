import { useState, useCallback } from 'react';
import AnalogClock from '../clock/AnalogClock';
import ChoiceButton from './ChoiceButton';
import FeedbackOverlay from './FeedbackOverlay';
import type { Exercise, FeedbackType } from '../../types';
import { playCorrectSound, playWrongSound } from '../../utils/soundGenerator';

interface ReadTimePracticeProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
  soundEnabled: boolean;
}

export default function ReadTimePractice({
  exercise,
  onComplete,
  soundEnabled,
}: ReadTimePracticeProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [answerResults, setAnswerResults] = useState<Record<string, boolean | null>>({});

  const correctAnswer = exercise.correctAnswer;
  const options = exercise.options || [];

  const handleSelect = useCallback(
    (option: string) => {
      if (selectedAnswer !== null) return;
      const isCorrect = option === correctAnswer;

      setSelectedAnswer(option);
      setAnswerResults(prev => ({ ...prev, [option]: isCorrect }));

      if (isCorrect) {
        if (soundEnabled) playCorrectSound();
        setFeedback('correct');
        setFeedbackMessage('太棒了！你答对了！');
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
          setFeedbackMessage(`正确答案是 ${correctAnswer}`);
          setAnswerResults(prev => ({ ...prev, [correctAnswer]: true }));
          setTimeout(() => {
            setFeedback(null);
            onComplete(false);
          }, 2000);
        } else if (newWrongCount === 2) {
          setFeedback('hint');
          setFeedbackMessage(exercise.hint);
          setAnswerResults(prev => ({ ...prev, [correctAnswer]: true }));
          setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
          }, 2000);
        } else {
          setFeedback('encourage');
          setFeedbackMessage('再试试看！');
          setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
            setAnswerResults(prev => {
              const next = { ...prev };
              delete next[option];
              return next;
            });
          }, 1500);
        }
      }
    },
    [selectedAnswer, correctAnswer, soundEnabled, wrongCount, exercise.hint, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      {/* 题目 */}
      <p className="text-2xl font-bold text-text-primary">{exercise.question}</p>

      {/* 时钟 */}
      <div className="flex justify-center">
        <AnalogClock
          time={exercise.clockState || { hour: 12, minute: 0 }}
          showNumbers
          showAllNumbers
        />
      </div>

      {/* 选项 */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-[400px]">
        {options.map(option => (
          <ChoiceButton
            key={option}
            label={option}
            selected={selectedAnswer === option}
            correct={answerResults[option] ?? null}
            disabled={selectedAnswer !== null && selectedAnswer !== option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>

      {/* 反馈浮层 */}
      <FeedbackOverlay
        type={feedback}
        message={feedbackMessage}
        onDismiss={() => setFeedback(null)}
      />
    </div>
  );
}
