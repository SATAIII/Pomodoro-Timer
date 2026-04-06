import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionType = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  workDuration: number;       // in minutes
  shortBreakDuration: number;  // in minutes
  longBreakDuration: number;   // in minutes
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface SessionRecord {
  id: string;
  type: SessionType;
  duration: number;  // in seconds
  completedAt: string; // ISO timestamp
}

interface PomodoroState {
  // Timer state
  status: TimerStatus;
  sessionType: SessionType;
  timeRemaining: number;  // in seconds
  totalTime: number;      // in seconds (total for current session)

  // Session tracking
  completedSessions: number;
  sessionHistory: SessionRecord[];

  // Settings
  settings: PomodoroSettings;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  skipSession: () => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  getSessionDuration: (type: SessionType) => number;
  clearHistory: () => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

const getSessionDurationSeconds = (type: SessionType, settings: PomodoroSettings): number => {
  switch (type) {
    case 'work':
      return settings.workDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      sessionType: 'work',
      timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
      totalTime: DEFAULT_SETTINGS.workDuration * 60,
      completedSessions: 0,
      sessionHistory: [],
      settings: DEFAULT_SETTINGS,

      getSessionDuration: (type: SessionType) => {
        return getSessionDurationSeconds(type, get().settings);
      },

      startTimer: () => {
        const state = get();
        const duration = getSessionDurationSeconds(state.sessionType, state.settings);
        set({
          status: 'running',
          timeRemaining: duration,
          totalTime: duration,
        });
      },

      pauseTimer: () => {
        set({ status: 'paused' });
      },

      resumeTimer: () => {
        set({ status: 'running' });
      },

      resetTimer: () => {
        const state = get();
        const duration = getSessionDurationSeconds(state.sessionType, state.settings);
        set({
          status: 'idle',
          timeRemaining: duration,
          totalTime: duration,
        });
      },

      tick: () => {
        const state = get();
        if (state.status !== 'running') return;

        if (state.timeRemaining <= 1) {
          // Session completed
          const now = new Date().toISOString();
          const newRecord: SessionRecord = {
            id: crypto.randomUUID(),
            type: state.sessionType,
            duration: state.totalTime,
            completedAt: now,
          };

          const newCompletedSessions = state.sessionType === 'work'
            ? state.completedSessions + 1
            : state.completedSessions;

          // Determine next session type
          let nextSessionType: SessionType;
          if (state.sessionType === 'work') {
            nextSessionType = newCompletedSessions % state.settings.sessionsBeforeLongBreak === 0
              ? 'longBreak'
              : 'shortBreak';
          } else {
            nextSessionType = 'work';
          }

          const nextDuration = getSessionDurationSeconds(nextSessionType, state.settings);
          const shouldAutoStart = state.sessionType === 'work'
            ? state.settings.autoStartBreaks
            : state.settings.autoStartWork;

          set({
            status: shouldAutoStart ? 'running' : 'idle',
            sessionType: nextSessionType,
            timeRemaining: nextDuration,
            totalTime: nextDuration,
            completedSessions: newCompletedSessions,
            sessionHistory: [newRecord, ...state.sessionHistory],
          });

          // Play notification sound
          playNotificationSound();
          return;
        }

        set({ timeRemaining: state.timeRemaining - 1 });
      },

      skipSession: () => {
        const state = get();
        let nextSessionType: SessionType;

        if (state.sessionType === 'work') {
          nextSessionType = (state.completedSessions + 1) % state.settings.sessionsBeforeLongBreak === 0
            ? 'longBreak'
            : 'shortBreak';
        } else {
          nextSessionType = 'work';
        }

        const nextDuration = getSessionDurationSeconds(nextSessionType, state.settings);
        set({
          status: 'idle',
          sessionType: nextSessionType,
          timeRemaining: nextDuration,
          totalTime: nextDuration,
        });
      },

      updateSettings: (newSettings: Partial<PomodoroSettings>) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };

        // If timer is idle, update the current timer duration
        if (state.status === 'idle') {
          const duration = getSessionDurationSeconds(state.sessionType, updatedSettings);
          set({
            settings: updatedSettings,
            timeRemaining: duration,
            totalTime: duration,
          });
        } else {
          set({ settings: updatedSettings });
        }
      },

      clearHistory: () => {
        set({ sessionHistory: [], completedSessions: 0 });
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        settings: state.settings,
        completedSessions: state.completedSessions,
        sessionHistory: state.sessionHistory.slice(0, 100), // Keep last 100 records
      }),
    }
  )
);

function playNotificationSound() {
  if (typeof window === 'undefined') return;

  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create a pleasant bell-like sound
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord
    const startTime = audioContext.currentTime;

    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.15);

      gainNode.gain.setValueAtTime(0, startTime + i * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + i * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.15 + 0.8);

      oscillator.start(startTime + i * 0.15);
      oscillator.stop(startTime + i * 0.15 + 0.8);
    });
  } catch {
    // Fallback: no sound if Web Audio API is not available
  }
}
