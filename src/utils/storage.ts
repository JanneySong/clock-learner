import type { UserProgress, UserSettings, PracticeStatistics } from '../types';

const STORAGE_KEYS = {
  PROGRESS: 'clock-app:progress',
  SETTINGS: 'clock-app:settings',
  STATISTICS: 'clock-app:statistics',
} as const;

const DEFAULT_PROGRESS: UserProgress = {
  version: 1,
  currentLevel: 1,
  totalStars: 0,
  completedExercises: [],
  levelStars: {},
  knowledgeMastery: {
    'clock-face': 0,
    'whole-hour': 0,
    'half-hour': 0,
    'approximate': 0,
    'calculation': 0,
    'life-scene': 0,
  },
  streakDays: 0,
  lastPracticeDate: '',
  createdAt: Date.now(),
};

const DEFAULT_SETTINGS: UserSettings = {
  version: 1,
  soundEnabled: true,
  difficulty: 1,
  dailyQuestionLimit: 0,
  dailyTimeLimit: 15,
  restReminderInterval: 15,
};

const DEFAULT_STATISTICS: PracticeStatistics = {
  version: 1,
  totalAttempts: 0,
  correctCount: 0,
  wrongQuestions: [],
  todayAttempts: 0,
  todayCorrect: 0,
  todayDate: '',
  sessionStartTime: 0,
};

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const data = JSON.parse(raw);
    if (data.version !== (defaultValue as Record<string, unknown>).version) {
      return defaultValue;
    }
    return { ...defaultValue, ...data };
  } catch {
    return defaultValue;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable, silently fail
  }
}

// Progress
export function loadProgress(): UserProgress {
  return loadStorage(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS);
}

export function saveProgress(progress: UserProgress): void {
  saveStorage(STORAGE_KEYS.PROGRESS, progress);
}

// Settings
export function loadSettings(): UserSettings {
  return loadStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: UserSettings): void {
  saveStorage(STORAGE_KEYS.SETTINGS, settings);
}

// Statistics
export function loadStatistics(): PracticeStatistics {
  const stats = loadStorage(STORAGE_KEYS.STATISTICS, DEFAULT_STATISTICS);
  const today = new Date().toISOString().split('T')[0];
  if (stats.todayDate !== today) {
    stats.todayDate = today;
    stats.todayAttempts = 0;
    stats.todayCorrect = 0;
  }
  return stats;
}

export function saveStatistics(stats: PracticeStatistics): void {
  saveStorage(STORAGE_KEYS.STATISTICS, stats);
}

// Reset all data
export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
