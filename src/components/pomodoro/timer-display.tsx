'use client';

import { motion } from 'framer-motion';
import { usePomodoroStore, SessionType } from '@/store/pomodoro-store';

const sessionConfig: Record<SessionType, { label: string; color: string; bgColor: string; ringColor: string }> = {
  work: {
    label: 'Focus Time',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    ringColor: 'stroke-rose-500',
  },
  shortBreak: {
    label: 'Short Break',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    ringColor: 'stroke-emerald-500',
  },
  longBreak: {
    label: 'Long Break',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    ringColor: 'stroke-sky-500',
  },
};

export function TimerDisplay() {
  const timeRemaining = usePomodoroStore((s) => s.timeRemaining);
  const totalTime = usePomodoroStore((s) => s.totalTime);
  const sessionType = usePomodoroStore((s) => s.sessionType);
  const status = usePomodoroStore((s) => s.status);

  const config = sessionConfig[sessionType];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;

  // SVG circle properties
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Session type badge */}
      <motion.div
        key={sessionType}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`px-4 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}
        role="status"
        aria-live="polite"
        aria-label={`Current session: ${config.label}`}
      >
        {config.label}
      </motion.div>

      {/* Circular timer */}
      <div
        className="relative flex items-center justify-center"
        role="timer"
        aria-label={`${minutes} minutes ${seconds} seconds remaining`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={config.ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={`${minutes}:${seconds}`}
            initial={{ y: -5, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={`text-7xl sm:text-8xl font-bold tabular-nums tracking-tight ${
              status === 'paused' ? 'text-amber-500' : 'text-foreground'
            }`}
          >
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </motion.span>
          {status === 'paused' && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-amber-500 font-medium mt-1"
            >
              PAUSED
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
