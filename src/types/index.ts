// 时钟时间状态
export interface ClockTime {
  hour: number; // 1-12
  minute: number; // 0-59
}

// 练习类型
export type ExerciseType =
  | 'read-time'      // 看钟说时
  | 'set-time'       // 看时拨钟
  | 'match-time'     // 选择连线
  | 'draw-hands'     // 画针补钟
  | 'calculate-time' // 时间推算
  | 'life-scene';    // 生活情境

// 难度等级
export type DifficultyLevel = 1 | 2 | 3 | 4;

// 知识点类型
export type KnowledgePoint =
  | 'clock-face'      // 钟面认知
  | 'whole-hour'      // 整时
  | 'half-hour'       // 半时
  | 'approximate'     // 大约几时
  | 'calculation'     // 时间推算
  | 'life-scene';     // 生活情境

// 练习题
export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  knowledgePoint: KnowledgePoint;
  clockState?: ClockTime;
  targetTime?: ClockTime;
  options?: string[];
  correctAnswer: string;
  question: string;
  hint: string;
}

// 关卡配置
export interface Level {
  id: string;
  title: string;
  description: string;
  story: string;
  characterEmoji: string;
  difficulty: DifficultyLevel;
  exerciseCount: number;
  requiredStars: number;
  knowledgePoints: KnowledgePoint[];
  exerciseTypes: ExerciseType[];
}

// 用户进度
export interface UserProgress {
  version: 1;
  currentLevel: number;
  totalStars: number;
  completedExercises: string[];
  levelStars: Record<string, number>; // levelId -> star count (1-5)
  knowledgeMastery: Record<KnowledgePoint, number>; // 0-100 percentage
  streakDays: number;
  lastPracticeDate: string;
  createdAt: number;
}

// 用户设置
export interface UserSettings {
  version: 1;
  soundEnabled: boolean;
  difficulty: DifficultyLevel;
  dailyQuestionLimit: number; // 0 = no limit
  dailyTimeLimit: number; // minutes, 0 = no limit
  restReminderInterval: number; // minutes
}

// 练习统计
export interface PracticeStatistics {
  version: 1;
  totalAttempts: number;
  correctCount: number;
  wrongQuestions: WrongQuestion[];
  todayAttempts: number;
  todayCorrect: number;
  todayDate: string;
  sessionStartTime: number;
}

// 错题记录
export interface WrongQuestion {
  exerciseId: string;
  userAnswer: string;
  timestamp: number;
  retryCount: number;
}

// 勋章
export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: number;
}

// 反馈类型
export type FeedbackType = 'correct' | 'wrong' | 'hint' | 'encourage';

// 陪伴角色
export type CompanionCharacter = 'rabbit' | 'cat' | 'bear' | 'bird';

// 练习会话状态
export interface PracticeSession {
  levelId: string;
  exercises: Exercise[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  consecutiveCorrect: number;
  stars: number;
  startTime: number;
  completed: boolean;
}
