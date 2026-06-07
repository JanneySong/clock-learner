import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadProgress } from '../utils/storage';
import { levels } from '../data/levels';
import StarRating from '../components/ui/StarRating';

export default function HomePage() {
  const navigate = useNavigate();
  const progress = loadProgress();

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      {/* 欢迎区域 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-1">
          时钟小达人 ⏰
        </h1>
        <p className="text-lg text-text-secondary">一起认识时间吧！</p>
      </motion.div>

      {/* 星星总数 */}
      <motion.div
        className="bg-white rounded-2xl px-6 py-3 shadow-sm border-2 border-bg-card flex items-center gap-3"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <span className="text-3xl">⭐</span>
        <span className="text-2xl font-bold text-accent font-[Fredoka,sans-serif]">
          {progress.totalStars}
        </span>
      </motion.div>

      {/* 关卡选择 */}
      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold text-text-primary mb-3">🗺️ 选择关卡</h2>
        <div className="flex flex-col gap-3">
          {levels.map((level, index) => {
            const isUnlocked = progress.totalStars >= level.requiredStars;
            const levelStars = progress.levelStars[level.id] || 0;

            return (
              <motion.button
                key={level.id}
                onClick={() => isUnlocked && navigate(`/practice?level=${level.id}`)}
                disabled={!isUnlocked}
                className={`
                  w-full bg-white rounded-2xl p-4 border-2 text-left
                  transition-all duration-150 btn-press
                  ${isUnlocked
                    ? 'border-bg-card hover:border-accent cursor-pointer'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'}
                `}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {isUnlocked ? level.characterEmoji : '🔒'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-text-primary">{level.title}</h3>
                      {!isUnlocked && (
                        <span className="text-sm text-text-secondary">
                          需要 {level.requiredStars} ⭐
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">{level.description}</p>
                    <p className="text-sm text-accent">{level.story}</p>
                  </div>
                  {isUnlocked && (
                    <StarRating total={5} earned={levelStars} size="sm" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold text-text-primary mb-3">🎮 快速开始</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/learn')}
            className="bg-white rounded-2xl p-4 border-2 border-bg-card btn-press cursor-pointer"
          >
            <span className="text-3xl">📖</span>
            <p className="text-base font-bold mt-2">学习</p>
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="bg-white rounded-2xl p-4 border-2 border-bg-card btn-press cursor-pointer"
          >
            <span className="text-3xl">🔍</span>
            <p className="text-base font-bold mt-2">探索</p>
          </button>
        </div>
      </div>
    </div>
  );
}
