import type { ClockTime } from '../types';

// 将时间转换为角度（以12点方向为0度，顺时针）
export function timeToAngle(hour: number, minute: number): { hourAngle: number; minuteAngle: number } {
  // 分针角度：每分钟6度 (360/60)
  const minuteAngle = minute * 6;
  // 时针角度：每小时30度 (360/12) + 分钟带来的偏移 (每分钟0.5度)
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  return { hourAngle, minuteAngle };
}

// 将角度转换为时间
export function angleToTime(angleDeg: number, hand: 'hour' | 'minute'): number {
  const normalized = ((angleDeg % 360) + 360) % 360;
  if (hand === 'hour') {
    return Math.round(normalized / 30) % 12 || 12;
  }
  return Math.round(normalized / 6) % 60;
}

// 计算指针角度从中心点到鼠标位置
export function calculateAngleFromCenter(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number {
  const dx = pointX - centerX;
  const dy = pointY - centerY;
  // atan2 返回弧度，从正x轴逆时针；我们需从12点方向顺时针
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return angle;
}

// 格式化时间显示（中文格式）
export function formatTimeChinese(time: ClockTime): string {
  if (time.minute === 0) {
    return `${time.hour}时`;
  } else if (time.minute === 30) {
    return `${time.hour}时半`;
  }
  return `${time.hour}时${time.minute}分`;
}

// 格式化时间显示（电子表格式）
export function formatTimeDigital(time: ClockTime): string {
  return `${time.hour}:${time.minute.toString().padStart(2, '0')}`;
}

// 格式化大约几时
export function formatApproximateTime(time: ClockTime): string {
  if (time.minute >= 50) {
    const nextHour = time.hour === 12 ? 1 : time.hour + 1;
    return `快${nextHour}时了`;
  } else if (time.minute > 0 && time.minute <= 10) {
    return `${time.hour}时过一点`;
  }
  return formatTimeChinese(time);
}

// 磁吸对齐到最近的刻度
export function snapToNearestMark(angle: number, snapMinutes: number = 5): number {
  const snapAngle = snapMinutes * 6; // 每分钟6度
  return Math.round(angle / snapAngle) * snapAngle;
}

// 计算时针和分针联动
export function calculateLinkedTime(hourAngle: number, minuteAngle: number): ClockTime {
  const minute = Math.round(minuteAngle / 6) % 60;
  const rawHour = Math.round(hourAngle / 30) % 12;
  const hour = rawHour === 0 ? 12 : rawHour;
  return { hour, minute };
}

// 时间推算
export function addHours(time: ClockTime, hours: number): ClockTime {
  let newHour = time.hour + hours;
  while (newHour > 12) newHour -= 12;
  while (newHour <= 0) newHour += 12;
  return { hour: newHour, minute: time.minute };
}

// 判断两个时间是否相等（允许一定容差）
export function isTimeEqual(a: ClockTime, b: ClockTime, toleranceMinutes: number = 0): boolean {
  if (toleranceMinutes === 0) {
    return a.hour === b.hour && a.minute === b.minute;
  }
  const aMinutes = (a.hour % 12) * 60 + a.minute;
  const bMinutes = (b.hour % 12) * 60 + b.minute;
  return Math.abs(aMinutes - bMinutes) <= toleranceMinutes;
}

// 生成随机时间
export function randomTime(
  _allowWholeHour: boolean = true,
  allowHalfHour: boolean = false,
  allowAnyMinute: boolean = false
): ClockTime {
  const hour = Math.floor(Math.random() * 12) + 1;
  let minute: number;
  if (allowAnyMinute) {
    minute = Math.floor(Math.random() * 60);
  } else if (allowHalfHour && Math.random() > 0.5) {
    minute = 30;
  } else {
    minute = 0;
  }
  return { hour, minute };
}
