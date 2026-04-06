'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePomodoroStore } from '@/store/pomodoro-store';

export function TimerControls() {
  const status = usePomodoroStore((s) => s.status);
  const startTimer = usePomodoroStore((s) => s.startTimer);
  const pauseTimer = usePomodoroStore((s) => s.pauseTimer);
  const resumeTimer = usePomodoroStore((s) => s.resumeTimer);
  const resetTimer = usePomodoroStore((s) => s.resetTimer);
  const skipSession = usePomodoroStore((s) => s.skipSession);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-3">
        {/* Reset button */}
        {(status === 'running' || status === 'paused') && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                  aria-label="Reset timer"
                  className="h-12 w-12 rounded-full"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {/* Main action button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => {
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
            }}
            aria-label={
              status === 'idle'
                ? 'Start timer'
                : status === 'running'
                ? 'Pause timer'
                : 'Resume timer'
            }
            className="h-16 w-16 rounded-full text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
            size="icon"
          >
            {status === 'idle' ? (
              <Play className="h-7 w-7 ml-1" />
            ) : status === 'running' ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-1" />
            )}
          </Button>
        </motion.div>

        {/* Skip button */}
        {(status === 'running' || status === 'paused') && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={skipSession}
                  aria-label="Skip to next session"
                  className="h-12 w-12 rounded-full"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Skip</TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
}
