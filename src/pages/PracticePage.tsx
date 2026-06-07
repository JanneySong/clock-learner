import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReadTimePractice from '../components/practice/ReadTimePractice';
import SetTimePractice from '../components/practice/SetTimePractice';
import ProgressBar from '../components/ui/ProgressBar';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import { loadProgress, saveProgress, loadSettings, saveStatistics, loadStatistics } from '../utils/storage';
import { exercisesByKnowledge } from '../data/exercises';
import { getLevelById } from '../data/levels';
import { playCelebrationSound } from '../utils/soundGenerator';
import type { Exercise, PracticeSession } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PracticePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const levelId = searchParams.get('level');
  const level = levelId ? getLevelById(levelId) : null;
  const settings = loadSettings();

  // 根据关卡生成练习题
  const exercises = useMemo<Exercise[]>(() => {
    if (!level) {
      // 没有关卡时，显示自由练习选项
      return [];
    }
    const relevantExercises = level.knowledgePoints
      .flatMap((kp: string) => exercisesByKnowledge[kp] || [])
      .filter((e: Exercise) => level.exerciseTypes.includes(e.type));
    return shuffleArray(relevantExercises).slice(0, level.exerciseCount);
  }, [level]);

  const [session, setSession] = useState<PracticeSession>({
    levelId: levelId || 'free',
    exercises,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    consecutiveCorrect: 0,
    stars: 0,
    startTime: Date.now(),
    completed: false,
  });

  const [showResult, setShowResult] = useState(false);

  const currentExercise = session.exercises[session.currentIndex];
  const totalExercises = session.exercises.length;

  const handleComplete = useCallback((correct: boolean) => {
    setSession((prev: PracticeSession) => {
      const newConsecutive = correct ? prev.consecutiveCorrect + 1 : 0;
      const newStars = correct
        ? prev.stars + (newConsecutive >= 3 ? 2 : 1)
        : prev.stars;
      const nextIndex = prev.currentIndex + 1;
      const isCompleted = nextIndex >= prev.exercises.length;

      if (isCompleted) {
        // 更新进度
        const progress = loadProgress();
        const earnedStars = Math.min(newStars, 5);
        progress.totalStars += newStars;
        if (levelId) {
          progress.levelStars[levelId] = Math.max(
            progress.levelStars[levelId] || 0,
            earnedStars
          );
        }
        progress.lastPracticeDate = new Date().toISOString().split('T')[0];
        saveProgress(progress);

        // 更新统计
        const stats = loadStatistics();
        stats.totalAttempts += prev.exercises.length;
        stats.correctCount += prev.correctCount + (correct ? 1 : 0);
        stats.todayAttempts += prev.exercises.length;
        stats.todayCorrect += prev.correctCount + (correct ? 1 : 0);
        saveStatistics(stats);

        if (settings.soundEnabled) playCelebrationSound();
        setShowResult(true);
      }

      return {
        ...prev,
        currentIndex: nextIndex,
        correctCount: prev.correctCount + (correct ? 1 : 0),
        wrongCount: prev.wrongCount + (correct ? 0 : 1),
        consecutiveCorrect: newConsecutive,
        stars: newStars,
        completed: isCompleted,
      };
    });
  }, [levelId, settings.soundEnabled]);

  if (!level && !levelId) {
    // 没有关卡参数，显示练习模式选择
    return (
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        <h2 className="text-2xl font-bold">✏️ 选择练习类型</h2>
        <div className="flex flex-col gap-4 w-full max-w-[400px]">
          <button
            onClick={() => navigate('/practice?level=level-1')}
            className="bg-white rounded-2xl p-5 border-2 border-bg-card btn-press cursor-pointer text-left"
          >
            <span className="text-3xl">🕐</span>
            <h3 className="text-xl font-bold mt-2">整时练习</h3>
            <p className="text-sm text-text-secondary">认识整时，分针指向12</p>
          </button>
          <button
            onClick={() => navigate('/practice?level=level-2')}
            className="bg-white rounded-2xl p-5 border-2 border-bg-card btn-press cursor-pointer text-left"
          >
            <span className="text-3xl">🕜</span>
            <h3 className="text-xl font-bold mt-2">半时练习</h3>
            <p className="text-sm text-text-secondary">认识半时，分针指向6</p>
          </button>
          <button
            onClick={() => navigate('/practice?level=level-3')}
            className="bg-white rounded-2xl p-5 border-2 border-bg-card btn-press cursor-pointer text-left"
          >
            <span className="text-3xl">🕰️</span>
            <h3 className="text-xl font-bold mt-2">混合练习</h3>
            <p className="text-sm text-text-secondary">整时、半时和大约几时</p>
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    // 显示结果页面
    const accuracy = totalExercises > 0
      ? Math.round((session.correctCount / totalExercises) * 100)
      : 0;
    const earnedStars = Math.min(session.stars, 5);

    return (
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <span className="text-6xl">{earnedStars >= 4 ? '🎉' : earnedStars >= 2 ? '👍' : '💪'}</span>
          <h2 className="text-2xl font-bold mt-4">
            {earnedStars >= 4 ? '太棒了！' : earnedStars >= 2 ? '做得不错！' : '继续加油！'}
          </h2>
        </motion.div>

        <div className="bg-white rounded-2xl p-6 border-2 border-bg-card w-full max-w-[300px]">
          <div className="text-center mb-4">
            <StarRating total={5} earned={earnedStars} size="lg" animated />
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <div className="flex justify-between">
              <span>答对</span>
              <span className="font-bold text-correct">{session.correctCount}题</span>
            </div>
            <div className="flex justify-between">
              <span>答错</span>
              <span className="font-bold text-error">{session.wrongCount}题</span>
            </div>
            <div className="flex justify-between">
              <span>正确率</span>
              <span className="font-bold text-accent">{accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span>获得星星</span>
              <span className="font-bold text-accent">{session.stars}⭐</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/')} variant="secondary" icon="🏠">
            首页
          </Button>
          <Button onClick={() => navigate(-1)} variant="primary" icon="🔄">
            再来一次
          </Button>
        </div>
      </div>
    );
  }

  if (!currentExercise || totalExercises === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <span className="text-4xl">📭</span>
        <p className="text-xl text-text-secondary">暂无练习题</p>
        <Button onClick={() => navigate('/')} icon="🏠">返回首页</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2 px-2">
      {/* 进度信息 */}
      <div className="w-full max-w-[400px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-text-secondary">
            {level?.characterEmoji} 第 {session.currentIndex + 1} / {totalExercises} 题
          </span>
          <span className="text-sm font-bold text-accent">{session.stars} ⭐</span>
        </div>
        <ProgressBar current={session.currentIndex} total={totalExercises} />
      </div>

      {/* 当前题目 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          className="w-full flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          {currentExercise.type === 'set-time' ? (
            <SetTimePractice
              exercise={currentExercise}
              onComplete={handleComplete}
              soundEnabled={settings.soundEnabled}
            />
          ) : (
            <ReadTimePractice
              exercise={currentExercise}
              onComplete={handleComplete}
              soundEnabled={settings.soundEnabled}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
