'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePomodoroStore } from '@/store/pomodoro-store';

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = usePomodoroStore((state) => state.tick);
  const status = usePomodoroStore((state) => state.status);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();

    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }

    return clearTimer;
  }, [status, tick, clearTimer]);

  // Update document title with timer
  useEffect(() => {
    const state = usePomodoroStore.getState();
    if (state.status === 'idle') {
      document.title = 'Pomodoro Tracker';
      return;
    }

    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const sessionLabel = state.sessionType === 'work' ? '🍅' : '☕';

    document.title = `${timeStr} ${sessionLabel} - Pomodoro Tracker`;
  }, [status, usePomodoroStore.getState().timeRemaining, usePomodoroStore.getState().sessionType]);

  return null;
}
