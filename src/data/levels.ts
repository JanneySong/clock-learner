import type { Level } from '../types';

export const levels: Level[] = [
  {
    id: 'level-1',
    title: '整时闯关',
    description: '认识整时，分针指向12',
    story: '帮小兔按时找到胡萝卜 🥕',
    characterEmoji: '🐰',
    difficulty: 1,
    exerciseCount: 8,
    requiredStars: 0,
    knowledgePoints: ['clock-face', 'whole-hour'],
    exerciseTypes: ['read-time', 'set-time'],
  },
  {
    id: 'level-2',
    title: '半时闯关',
    description: '认识半时，分针指向6',
    story: '帮小猫准时参加下午茶 🍵',
    characterEmoji: '🐱',
    difficulty: 2,
    exerciseCount: 8,
    requiredStars: 10,
    knowledgePoints: ['whole-hour', 'half-hour'],
    exerciseTypes: ['read-time', 'set-time'],
  },
  {
    id: 'level-3',
    title: '混合闯关',
    description: '整时和半时大挑战',
    story: '帮小熊安排一天的行程 🐻',
    characterEmoji: '🐻',
    difficulty: 3,
    exerciseCount: 10,
    requiredStars: 25,
    knowledgePoints: ['whole-hour', 'half-hour', 'approximate'],
    exerciseTypes: ['read-time', 'set-time', 'calculate-time', 'life-scene'],
  },
  {
    id: 'level-4',
    title: '终极挑战',
    description: '成为时间小达人',
    story: '用你学到的所有知识！ 🏆',
    characterEmoji: '🐦',
    difficulty: 4,
    exerciseCount: 12,
    requiredStars: 50,
    knowledgePoints: ['clock-face', 'whole-hour', 'half-hour', 'approximate', 'calculation', 'life-scene'],
    exerciseTypes: ['read-time', 'set-time', 'calculate-time', 'life-scene'],
  },
];

export function getLevelById(id: string): Level | undefined {
  return levels.find(l => l.id === id);
}
