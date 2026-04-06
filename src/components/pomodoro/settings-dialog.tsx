'use client';

import { useState } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePomodoroStore, PomodoroSettings } from '@/store/pomodoro-store';

export function SettingsDialog() {
  const settings = usePomodoroStore((s) => s.settings);
  const updateSettings = usePomodoroStore((s) => s.updateSettings);
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<PomodoroSettings>(settings);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSettings(settings);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setOpen(false);
  };

  const handleReset = () => {
    const defaults: PomodoroSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartWork: false,
    };
    setLocalSettings(defaults);
    updateSettings(defaults);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Timer settings"
          className="h-10 w-10 rounded-full"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="settings-description">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription id="settings-description">
            Configure your Pomodoro session durations and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Time Settings */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Duration (minutes)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="work-duration" className="text-xs text-center block">
                  🍅 Focus
                </Label>
                <Input
                  id="work-duration"
                  type="number"
                  min={1}
                  max={120}
                  value={localSettings.workDuration}
                  onChange={(e) =>
                    setLocalSettings((s) => ({
                      ...s,
                      workDuration: Math.max(1, Math.min(120, parseInt(e.target.value) || 1)),
                    }))
                  }
                  className="text-center"
                  aria-label="Work session duration in minutes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-break" className="text-xs text-center block">
                  ☕ Short
                </Label>
                <Input
                  id="short-break"
                  type="number"
                  min={1}
                  max={30}
                  value={localSettings.shortBreakDuration}
                  onChange={(e) =>
                    setLocalSettings((s) => ({
                      ...s,
                      shortBreakDuration: Math.max(1, Math.min(30, parseInt(e.target.value) || 1)),
                    }))
                  }
                  className="text-center"
                  aria-label="Short break duration in minutes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break" className="text-xs text-center block">
                  🌿 Long
                </Label>
                <Input
                  id="long-break"
                  type="number"
                  min={1}
                  max={60}
                  value={localSettings.longBreakDuration}
                  onChange={(e) =>
                    setLocalSettings((s) => ({
                      ...s,
                      longBreakDuration: Math.max(1, Math.min(60, parseInt(e.target.value) || 1)),
                    }))
                  }
                  className="text-center"
                  aria-label="Long break duration in minutes"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Session count */}
          <div className="space-y-2">
            <Label htmlFor="sessions-count" className="text-sm font-medium">
              Long break after
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="sessions-count"
                type="number"
                min={2}
                max={10}
                value={localSettings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  setLocalSettings((s) => ({
                    ...s,
                    sessionsBeforeLongBreak: Math.max(2, Math.min(10, parseInt(e.target.value) || 4)),
                  }))
                }
                className="w-20 text-center"
                aria-label="Number of work sessions before long break"
              />
              <span className="text-sm text-muted-foreground">work sessions</span>
            </div>
          </div>

          <Separator />

          {/* Auto-start toggles */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Auto Start
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-breaks" className="text-sm cursor-pointer">
                Auto-start breaks
              </Label>
              <Switch
                id="auto-breaks"
                checked={localSettings.autoStartBreaks}
                onCheckedChange={(checked) =>
                  setLocalSettings((s) => ({ ...s, autoStartBreaks: checked }))
                }
                aria-label="Automatically start break sessions"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-work" className="text-sm cursor-pointer">
                Auto-start work sessions
              </Label>
              <Switch
                id="auto-work"
                checked={localSettings.autoStartWork}
                onCheckedChange={(checked) =>
                  setLocalSettings((s) => ({ ...s, autoStartWork: checked }))
                }
                aria-label="Automatically start work sessions"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
            aria-label="Reset settings to defaults"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
