'use client';

import { useTimer } from '@/hooks/use-timer';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { TimerDisplay } from '@/components/pomodoro/timer-display';
import { TimerControls } from '@/components/pomodoro/timer-controls';
import { SessionSelector } from '@/components/pomodoro/session-selector';
import { SettingsDialog } from '@/components/pomodoro/settings-dialog';
import { SessionHistory } from '@/components/pomodoro/session-history';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

export default function Home() {
  // Initialize the timer hook
  useTimer();
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  const completedSessions = usePomodoroStore((s) => s.completedSessions);
  const status = usePomodoroStore((s) => s.status);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center">
              <Timer className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              Pomodoro<span className="text-rose-500">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {completedSessions > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <span>🍅</span>
                <span className="font-medium text-foreground">{completedSessions}</span>
                <span>sessions</span>
              </motion.div>
            )}
            <SettingsDialog />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-8"
          >
            {/* Session Type Tabs */}
            <SessionSelector />

            {/* Timer Display */}
            <TimerDisplay />

            {/* Controls */}
            <TimerControls />

            {/* Keyboard shortcuts hint */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Space</kbd>
                {status === 'idle' ? 'Start' : status === 'running' ? 'Pause' : 'Resume'}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">R</kbd>
                Reset
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">S</kbd>
                Skip
              </span>
            </div>
          </motion.div>

          {/* Sidebar - Session History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="order-first lg:order-last"
          >
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 shadow-sm">
              <SessionHistory />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Pomodoro Technique — Stay focused, be productive
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ and Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
