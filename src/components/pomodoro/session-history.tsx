'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Coffee, Leaf, Clock, Trash2 } from 'lucide-react';
import { usePomodoroStore, SessionRecord, SessionType } from '@/store/pomodoro-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

const sessionIcons: Record<SessionType, React.ReactNode> = {
  work: <CheckCircle2 className="h-3.5 w-3.5 text-rose-500" />,
  shortBreak: <Coffee className="h-3.5 w-3.5 text-emerald-500" />,
  longBreak: <Leaf className="h-3.5 w-3.5 text-sky-500" />,
};

const sessionLabels: Record<SessionType, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const sessionBadgeColors: Record<SessionType, string> = {
  work: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  shortBreak: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  longBreak: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

function SessionItem({ record }: { record: SessionRecord }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      {sessionIcons[record.type]}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`text-xs px-1.5 py-0 ${sessionBadgeColors[record.type]}`}>
            {sessionLabels[record.type]}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(record.duration)}
          </span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {format(new Date(record.completedAt), 'HH:mm')}
      </span>
    </motion.div>
  );
}

export function SessionHistory() {
  const sessionHistory = usePomodoroStore((s) => s.sessionHistory);
  const completedSessions = usePomodoroStore((s) => s.completedSessions);
  const clearHistory = usePomodoroStore((s) => s.clearHistory);

  // Group today's sessions
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySessions = sessionHistory.filter(
    (s) => new Date(s.completedAt) >= todayStart
  );
  const todayWorkSessions = todaySessions.filter((s) => s.type === 'work').length;
  const todayFocusMinutes = todaySessions
    .filter((s) => s.type === 'work')
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <div className="text-2xl font-bold text-foreground">{completedSessions}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Total</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <div className="text-2xl font-bold text-rose-500">{todayWorkSessions}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Today</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <div className="text-2xl font-bold text-emerald-500">
            {Math.floor(todayFocusMinutes)}m
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Focused</div>
        </div>
      </div>

      {/* Session progress dots */}
      <div className="flex items-center justify-center gap-2" aria-label="Session progress">
        {Array.from({ length: usePomodoroStore.getState().settings.sessionsBeforeLongBreak }).map((_, i) => {
          const isCompleted = i < (completedSessions % usePomodoroStore.getState().settings.sessionsBeforeLongBreak || usePomodoroStore.getState().settings.sessionsBeforeLongBreak);
          const isCurrent =
            !isCompleted &&
            i === completedSessions % usePomodoroStore.getState().settings.sessionsBeforeLongBreak;

          return (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-rose-500'
                  : isCurrent
                  ? 'bg-rose-300 ring-2 ring-rose-500 ring-offset-2 ring-offset-background'
                  : 'bg-muted'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Recent sessions */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Sessions</h3>
          {sessionHistory.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  aria-label="Clear all session history"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Session History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your session records and reset the session counter.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-destructive text-white hover:bg-destructive/90">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <ScrollArea className="max-h-64">
          <AnimatePresence mode="popLayout">
            {sessionHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-sm text-muted-foreground"
              >
                No sessions yet. Start your first focus session!
              </motion.div>
            ) : (
              <div className="space-y-0.5">
                {sessionHistory.slice(0, 20).map((record) => (
                  <SessionItem key={record.id} record={record} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  );
}
