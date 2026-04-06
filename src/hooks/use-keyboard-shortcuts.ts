'use client';

import { useEffect } from 'react';
import { usePomodoroStore } from '@/store/pomodoro-store';

export function useKeyboardShortcuts() {
  const status = usePomodoroStore((s) => s.status);
  const startTimer = usePomodoroStore((s) => s.startTimer);
  const pauseTimer = usePomodoroStore((s) => s.pauseTimer);
  const resumeTimer = usePomodoroStore((s) => s.resumeTimer);
  const resetTimer = usePomodoroStore((s) => s.resetTimer);
  const skipSession = usePomodoroStore((s) => s.skipSession);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard events when typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          switch (status) {
            case 'idle':
              startTimer();
              break;
            case 'running':
              pauseTimer();
              break;
            case 'paused':
              resumeTimer();
              break;
          }
          break;
        case 'KeyR':
          if (status !== 'idle') {
            e.preventDefault();
            resetTimer();
          }
          break;
        case 'KeyS':
          if (status !== 'idle') {
            e.preventDefault();
            skipSession();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, startTimer, pauseTimer, resumeTimer, resetTimer, skipSession]);
}
