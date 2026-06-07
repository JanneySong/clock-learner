import { useState } from 'react';
import { motion } from 'framer-motion';
import AnalogClock from '../components/clock/AnalogClock';
import DigitalClock from '../components/clock/DigitalClock';
import Button from '../components/ui/Button';
import type { ClockTime } from '../types';

const learnSteps = [
  {
    id: 'face',
    title: '认识钟面',
    emoji: '👀',
    content: '钟面有12个数字，围成一圈。还有两根针：短粗的叫时针哥哥，长细的叫分针弟弟。',
    time: { hour: 12, minute: 0 } as ClockTime,
  },
  {
    id: 'hour-hand',
    title: '时针哥哥',
    emoji: '🕺',
    content: '时针哥哥又短又粗，走得慢慢的。他指向几，就是几时。',
    time: { hour: 3, minute: 0 } as ClockTime,
  },
  {
    id: 'minute-hand',
    title: '分针弟弟',
    emoji: '🏃',
    content: '分针弟弟又长又细，走得快快的。他指向12的时候，就是整时！',
    time: { hour: 3, minute: 0 } as ClockTime,
  },
  {
    id: 'whole-hour',
    title: '认识整时',
    emoji: '🕐',
    content: '分针指向12，时针指向几，就是几时。比如时针指向3，分针指向12，就是3时！',
    time: { hour: 3, minute: 0 } as ClockTime,
  },
  {
    id: 'half-hour',
    title: '认识半时',
    emoji: '🕜',
    content: '分针指向6，时针在两个数字之间，就是几时半。比如时针在3和4之间，分针指向6，就是3时半！',
    time: { hour: 3, minute: 30 } as ClockTime,
  },
  {
    id: 'life',
    title: '时间与生活',
    emoji: '🏠',
    content: '我们的一天和时间息息相关：7时起床，8时上课，12时午餐，9时睡觉。认识时间，做个守时的好孩子！',
    time: { hour: 7, minute: 0 } as ClockTime,
  },
];

export default function LearnPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = learnSteps[currentStep];

  const goNext = () => {
    if (currentStep < learnSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 px-4">
      {/* 进度指示器 */}
      <div className="flex gap-2">
        {learnSteps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`
              w-3 h-3 rounded-full transition-colors
              ${i === currentStep ? 'bg-accent scale-125' : i < currentStep ? 'bg-correct' : 'bg-bg-card'}
            `}
          />
        ))}
      </div>

      {/* 标题 */}
      <motion.h2
        key={step.id}
        className="text-2xl font-bold text-text-primary"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {step.emoji} {step.title}
      </motion.h2>

      {/* 时钟展示 */}
      <motion.div
        key={step.id + '-clock'}
        className="flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <AnalogClock time={step.time} showNumbers showAllNumbers />
      </motion.div>

      {/* 数字时间 */}
      <DigitalClock time={step.time} />

      {/* 说明文字 */}
      <motion.div
        key={step.id + '-text'}
        className="bg-white rounded-2xl p-5 max-w-[400px] w-full border-2 border-bg-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-lg text-text-primary leading-relaxed">
          {step.content}
        </p>
      </motion.div>

      {/* 导航按钮 */}
      <div className="flex gap-4">
        <Button
          onClick={goPrev}
          disabled={currentStep === 0}
          variant="secondary"
          size="md"
          icon="←"
        >
          上一步
        </Button>
        <Button
          onClick={goNext}
          disabled={currentStep === learnSteps.length - 1}
          variant="primary"
          size="md"
          icon="→"
        >
          下一步
        </Button>
      </div>
    </div>
  );
}
