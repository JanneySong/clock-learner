import { motion } from 'framer-motion';
import { loadProgress, loadStatistics } from '../utils/storage';
import { levels } from '../data/levels';
import ProgressBar from '../components/ui/ProgressBar';
import type { KnowledgePoint, Level } from '../types';

const knowledgePointLabels: Record<KnowledgePoint, { label: string; emoji: string }> = {
  'clock-face': { label: '钟面认知', emoji: '👀' },
  'whole-hour': { label: '整时', emoji: '🕐' },
  'half-hour': { label: '半时', emoji: '🕜' },
  'approximate': { label: '大约几时', emoji: '🕰️' },
  'calculation': { label: '时间推算', emoji: '🧮' },
  'life-scene': { label: '生活情境', emoji: '🏠' },
};

const badgeList = [
  { id: 'badge-1', name: '钟面探索者', emoji: '🔍', description: '完成钟面认知学习' },
  { id: 'badge-2', name: '整时小能手', emoji: '🕐', description: '整时闯关通关' },
  { id: 'badge-3', name: '半时达人', emoji: '🕜', description: '半时闯关通关' },
  { id: 'badge-4', name: '时间指挥官', emoji: '⭐', description: '混合闯关通关' },
  { id: 'badge-5', name: '时间小达人', emoji: '🏆', description: '终极挑战通关' },
  { id: 'badge-6', name: '连胜达人', emoji: '🔥', description: '连续答对5题' },
  { id: 'badge-7', name: '坚持不懈', emoji: '📅', description: '连续7天练习' },
  { id: 'badge-8', name: '全对之星', emoji: '💎', description: '一关全对' },
];

export default function ProgressPage() {
  const progress = loadProgress();
  const stats = loadStatistics();

  const totalAccuracy = stats.totalAttempts > 0
    ? Math.round((stats.correctCount / stats.totalAttempts) * 100)
    : 0;

  // 判断勋章是否获得
  const isBadgeUnlocked = (badgeId: string): boolean => {
    switch (badgeId) {
      case 'badge-1': return (progress.knowledgeMastery['clock-face'] || 0) > 0;
      case 'badge-2': return (progress.levelStars['level-1'] || 0) > 0;
      case 'badge-3': return (progress.levelStars['level-2'] || 0) > 0;
      case 'badge-4': return (progress.levelStars['level-3'] || 0) > 0;
      case 'badge-5': return (progress.levelStars['level-4'] || 0) > 0;
      case 'badge-6': return stats.correctCount >= 5;
      case 'badge-7': return progress.streakDays >= 7;
      case 'badge-8': return false;
      default: return false;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 px-4">
      {/* 总览 */}
      <motion.div
        className="bg-white rounded-2xl p-5 w-full max-w-[400px] border-2 border-bg-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-3">📊 学习概况</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <span className="text-3xl">⭐</span>
            <p className="text-2xl font-bold text-accent font-[Fredoka,sans-serif]">{progress.totalStars}</p>
            <p className="text-sm text-text-secondary">总星星</p>
          </div>
          <div className="text-center">
            <span className="text-3xl">🎯</span>
            <p className="text-2xl font-bold text-correct font-[Fredoka,sans-serif]">{totalAccuracy}%</p>
            <p className="text-sm text-text-secondary">正确率</p>
          </div>
          <div className="text-center">
            <span className="text-3xl">📝</span>
            <p className="text-2xl font-bold font-[Fredoka,sans-serif]">{stats.totalAttempts}</p>
            <p className="text-sm text-text-secondary">总答题</p>
          </div>
          <div className="text-center">
            <span className="text-3xl">📅</span>
            <p className="text-2xl font-bold font-[Fredoka,sans-serif]">{progress.streakDays}</p>
            <p className="text-sm text-text-secondary">连续天数</p>
          </div>
        </div>
      </motion.div>

      {/* 知识点掌握 */}
      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold mb-3">📚 知识点掌握</h2>
        <div className="flex flex-col gap-3">
          {(Object.entries(knowledgePointLabels) as [KnowledgePoint, typeof knowledgePointLabels[KnowledgePoint]][]).map(
            ([key, { label, emoji }]) => {
              const mastery = progress.knowledgeMastery[key] || 0;
              return (
                <div key={key} className="bg-white rounded-xl p-3 border border-bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold">
                      {emoji} {label}
                    </span>
                    <span className="text-sm font-bold text-accent">{mastery}%</span>
                  </div>
                  <ProgressBar current={mastery} total={100} />
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* 关卡进度 */}
      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold mb-3">🗺️ 关卡进度</h2>
        <div className="flex flex-col gap-2">
          {levels.map((level: Level) => {
            const levelStars = progress.levelStars[level.id] || 0;
            const isUnlocked = progress.totalStars >= level.requiredStars;
            return (
              <div
                key={level.id}
                className={`bg-white rounded-xl p-3 border border-bg-card flex items-center gap-3 ${!isUnlocked ? 'opacity-50' : ''}`}
              >
                <span className="text-2xl">{isUnlocked ? level.characterEmoji : '🔒'}</span>
                <div className="flex-1">
                  <p className="font-bold">{level.title}</p>
                  <ProgressBar current={levelStars} total={5} />
                </div>
                <span className="text-sm font-bold text-accent">{levelStars}/5⭐</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 勋章墙 */}
      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold mb-3">🏅 勋章墙</h2>
        <div className="grid grid-cols-4 gap-3">
          {badgeList.map(badge => {
            const unlocked = isBadgeUnlocked(badge.id);
            return (
              <motion.div
                key={badge.id}
                className={`
                  bg-white rounded-xl p-2 border-2 text-center
                  ${unlocked ? 'border-accent' : 'border-bg-card opacity-40'}
                `}
                whileTap={unlocked ? { scale: 1.1 } : undefined}
              >
                <span className="text-2xl">{unlocked ? badge.emoji : '❓'}</span>
                <p className="text-xs font-bold mt-1">{badge.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 今日统计 */}
      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold mb-3">📝 今日练习</h2>
        <div className="bg-white rounded-2xl p-4 border-2 border-bg-card">
          <div className="flex justify-between text-lg">
            <span>今日答题</span>
            <span className="font-bold">{stats.todayAttempts}题</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>今日正确</span>
            <span className="font-bold text-correct">{stats.todayCorrect}题</span>
          </div>
        </div>
      </div>
    </div>
  );
}
