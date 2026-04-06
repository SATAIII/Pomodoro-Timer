'use client';

import { motion } from 'framer-motion';
import { usePomodoroStore, SessionType } from '@/store/pomodoro-store';
import { cn } from '@/lib/utils';

const sessionTabs: { type: SessionType; label: string; emoji: string }[] = [
  { type: 'work', label: 'Focus', emoji: '🍅' },
  { type: 'shortBreak', label: 'Short Break', emoji: '☕' },
  { type: 'longBreak', label: 'Long Break', emoji: '🌿' },
];

const sessionColors: Record<SessionType, string> = {
  work: 'bg-rose-500 text-white shadow-rose-500/30 shadow-lg',
  shortBreak: 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-lg',
  longBreak: 'bg-sky-500 text-white shadow-sky-500/30 shadow-lg',
};

const sessionIdleColors: Record<SessionType, string> = {
  work: 'hover:bg-rose-500/10 text-rose-500',
  shortBreak: 'hover:bg-emerald-500/10 text-emerald-500',
  longBreak: 'hover:bg-sky-500/10 text-sky-500',
};

export function SessionSelector() {
  const sessionType = usePomodoroStore((s) => s.sessionType);
  const status = usePomodoroStore((s) => s.status);
  const settings = usePomodoroStore((s) => s.settings);
  const updateSettings = usePomodoroStore((s) => s.updateSettings);

  const handleSessionChange = (type: SessionType) => {
    if (status !== 'idle') return;

    const durationMap: Record<SessionType, number> = {
      work: settings.workDuration,
      shortBreak: settings.shortBreakDuration,
      longBreak: settings.longBreakDuration,
    };

    const duration = durationMap[type] * 60;
    usePomodoroStore.setState({
      sessionType: type,
      timeRemaining: duration,
      totalTime: duration,
    });
  };

  return (
    <div
      className="flex gap-1 p-1 rounded-xl bg-muted/50 w-fit mx-auto"
      role="tablist"
      aria-label="Session type selector"
    >
      {sessionTabs.map((tab) => {
        const isActive = sessionType === tab.type;
        return (
          <button
            key={tab.type}
            role="tab"
            aria-selected={isActive}
            aria-label={`Switch to ${tab.label}`}
            disabled={status !== 'idle'}
            onClick={() => handleSessionChange(tab.type)}
            className={cn(
              'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              isActive
                ? sessionColors[tab.type]
                : cn(
                    'text-muted-foreground',
                    sessionIdleColors[tab.type],
                    status !== 'idle' && 'opacity-50 cursor-not-allowed'
                  )
            )}
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
            {isActive && (
              <motion.div
                layoutId="session-tab"
                className="absolute inset-0 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                style={{
                  background: 'transparent',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
