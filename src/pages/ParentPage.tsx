import { useState } from 'react';
import { motion } from 'framer-motion';
import { loadProgress, loadStatistics, loadSettings, saveSettings, resetAllData } from '../utils/storage';
import { levels } from '../data/levels';
import type { UserSettings, Level, KnowledgePoint } from '../types';

const knowledgeLabels: Record<KnowledgePoint, string> = {
  'clock-face': '钟面认知',
  'whole-hour': '整时',
  'half-hour': '半时',
  'approximate': '大约几时',
  'calculation': '时间推算',
  'life-scene': '生活情境',
};

type TabType = 'report' | 'wrong' | 'settings';

export default function ParentPage() {
  const progress = loadProgress();
  const stats = loadStatistics();
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [activeTab, setActiveTab] = useState<TabType>('report');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalAccuracy = stats.totalAttempts > 0
    ? Math.round((stats.correctCount / stats.totalAttempts) * 100)
    : 0;

  const handleSaveSettings = (updated: UserSettings) => {
    setSettings(updated);
    saveSettings(updated);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const tabs: { id: TabType; label: string; emoji: string }[] = [
    { id: 'report', label: '学习报告', emoji: '📊' },
    { id: 'wrong', label: '错题分析', emoji: '📝' },
    { id: 'settings', label: '练习设置', emoji: '⚙️' },
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-4 px-4">
      {/* 标题 */}
      <h2 className="text-2xl font-bold text-text-primary">👨‍👩‍👧 家长中心</h2>

      {/* Tab 切换 */}
      <div className="flex gap-2 w-full max-w-[400px]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 px-3 rounded-xl text-base font-bold transition-colors btn-press
              ${activeTab === tab.id ? 'bg-accent text-white' : 'bg-bg-card text-text-secondary'}
            `}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* 学习报告 */}
      {activeTab === 'report' && (
        <motion.div
          className="w-full max-w-[400px] flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 总体概览 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">总体概览</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-primary rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-accent">{progress.totalStars}</p>
                <p className="text-sm text-text-secondary">总星星</p>
              </div>
              <div className="bg-bg-primary rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-correct">{totalAccuracy}%</p>
                <p className="text-sm text-text-secondary">总正确率</p>
              </div>
              <div className="bg-bg-primary rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                <p className="text-sm text-text-secondary">总答题数</p>
              </div>
              <div className="bg-bg-primary rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{stats.correctCount}</p>
                <p className="text-sm text-text-secondary">答对数</p>
              </div>
            </div>
          </div>

          {/* 关卡进度 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">关卡进度</h3>
            {levels.map((level: Level) => {
              const stars = progress.levelStars[level.id] || 0;
              return (
                <div key={level.id} className="flex items-center gap-3 py-2 border-b border-bg-card last:border-0">
                  <span className="text-2xl">{level.characterEmoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{level.title}</p>
                    <div className="w-full h-2 bg-bg-card rounded-full mt-1">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${(stars / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold">{stars}/5 ⭐</span>
                </div>
              );
            })}
          </div>

          {/* 知识点掌握度 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">知识点掌握度</h3>
            {(Object.entries(knowledgeLabels) as [KnowledgePoint, string][]).map(([key, label]) => {
              const mastery = progress.knowledgeMastery[key] || 0;
              return (
                <div key={key} className="py-2 border-b border-bg-card last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold">{label}</span>
                    <span className="text-sm font-bold text-accent">{mastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-card rounded-full">
                    <div
                      className="h-full bg-correct rounded-full transition-all"
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 今日统计 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">今日练习</h3>
            <div className="flex justify-between py-1">
              <span className="text-base">今日答题</span>
              <span className="font-bold">{stats.todayAttempts} 题</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-base">今日正确</span>
              <span className="font-bold text-correct">{stats.todayCorrect} 题</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-base">连续练习天数</span>
              <span className="font-bold">{progress.streakDays} 天</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 错题分析 */}
      {activeTab === 'wrong' && (
        <motion.div
          className="w-full max-w-[400px] flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">错题记录</h3>
            {stats.wrongQuestions.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">🎉</span>
                <p className="text-base text-text-secondary mt-2">还没有错题记录，继续保持！</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.wrongQuestions.slice(-20).reverse().map((wq, idx) => (
                  <div key={idx} className="bg-bg-primary rounded-xl p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">题目 {wq.exerciseId}</span>
                      <span className="text-xs text-text-secondary">
                        重试 {wq.retryCount} 次
                      </span>
                    </div>
                    <p className="text-sm text-error mt-1">孩子回答: {wq.userAnswer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">📌 练习建议</h3>
            <div className="text-base text-text-secondary leading-relaxed">
              {totalAccuracy >= 90 ? (
                <p>孩子掌握得非常好！可以尝试提高难度或挑战更多题型。</p>
              ) : totalAccuracy >= 70 ? (
                <p>孩子表现不错！建议巩固薄弱知识点，多做半时练习。</p>
              ) : (
                <p>建议从整时开始练习，循序渐进，每天练习5-10题即可。</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* 练习设置 */}
      {activeTab === 'settings' && (
        <motion.div
          className="w-full max-w-[400px] flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 音效设置 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">音效</h3>
            <button
              onClick={() => handleSaveSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className="flex items-center gap-3 w-full"
            >
              <div className={`w-14 h-8 rounded-full relative transition-colors ${settings.soundEnabled ? 'bg-correct' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-base font-bold">{settings.soundEnabled ? '音效已开启' : '音效已关闭'}</span>
            </button>
          </div>

          {/* 难度设置 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">难度等级</h3>
            <div className="grid grid-cols-4 gap-2">
              {([1, 2, 3, 4] as const).map(d => (
                <button
                  key={d}
                  onClick={() => handleSaveSettings({ ...settings, difficulty: d })}
                  className={`
                    py-2 rounded-xl text-sm font-bold transition-colors btn-press
                    ${settings.difficulty === d ? 'bg-accent text-white' : 'bg-bg-card text-text-secondary'}
                  `}
                >
                  Lv.{d}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-2">
              {settings.difficulty === 1 ? '整时' : settings.difficulty === 2 ? '整时+半时' : settings.difficulty === 3 ? '含大约几时' : '全知识点'}
            </p>
          </div>

          {/* 每日题量 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">每日题量上限</h3>
            <div className="flex gap-2">
              {[0, 5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  onClick={() => handleSaveSettings({ ...settings, dailyQuestionLimit: n })}
                  className={`
                    flex-1 py-2 rounded-xl text-sm font-bold transition-colors btn-press
                    ${settings.dailyQuestionLimit === n ? 'bg-accent text-white' : 'bg-bg-card text-text-secondary'}
                  `}
                >
                  {n === 0 ? '不限' : `${n}`}
                </button>
              ))}
            </div>
          </div>

          {/* 练习时长 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">每日练习时长（分钟）</h3>
            <div className="flex gap-2">
              {[0, 10, 15, 20, 30].map(n => (
                <button
                  key={n}
                  onClick={() => handleSaveSettings({ ...settings, dailyTimeLimit: n })}
                  className={`
                    flex-1 py-2 rounded-xl text-sm font-bold transition-colors btn-press
                    ${settings.dailyTimeLimit === n ? 'bg-accent text-white' : 'bg-bg-card text-text-secondary'}
                  `}
                >
                  {n === 0 ? '不限' : `${n}`}
                </button>
              ))}
            </div>
          </div>

          {/* 休息提醒 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-bg-card">
            <h3 className="text-lg font-bold mb-3">休息提醒间隔（分钟）</h3>
            <div className="flex gap-2">
              {[10, 15, 20, 30].map(n => (
                <button
                  key={n}
                  onClick={() => handleSaveSettings({ ...settings, restReminderInterval: n })}
                  className={`
                    flex-1 py-2 rounded-xl text-sm font-bold transition-colors btn-press
                    ${settings.restReminderInterval === n ? 'bg-accent text-white' : 'bg-bg-card text-text-secondary'}
                  `}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* 重置数据 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-error">
            <h3 className="text-lg font-bold mb-2 text-error">重置数据</h3>
            <p className="text-sm text-text-secondary mb-3">
              清除所有学习进度、星星和统计记录。此操作不可撤销。
            </p>
            {showResetConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-error text-white rounded-xl font-bold"
                >
                  确认重置
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-bg-card text-text-primary rounded-xl font-bold"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="py-2 px-4 bg-error/10 text-error rounded-xl font-bold btn-press"
              >
                重置所有数据
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
