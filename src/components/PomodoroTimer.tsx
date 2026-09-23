import React, { useState, useEffect, useRef } from 'react';
import { Task, PomodoroSession, AppSettings } from '../types';
import { Play, Pause, SkipForward, Coffee, Brain, CheckCircle2 } from 'lucide-react';

interface PomodoroTimerProps {
  currentTask: Task | null;
  settings: AppSettings;
  onComplete: (session: PomodoroSession) => void;
  onTaskSelect: () => void;
}

export default function PomodoroTimer({
  currentTask,
  settings,
  onComplete,
  onTaskSelect,
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break' | 'long-break'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);

    if (sessionStartTime) {
      const session: PomodoroSession = {
        id: Date.now().toString(),
        taskId: currentTask?.id,
        startTime: sessionStartTime,
        endTime: new Date(),
        duration: getDuration(sessionType),
        completed: true,
        type: sessionType,
      };
      onComplete(session);
    }

    if (sessionType === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);

      if (newSessionsCompleted % settings.sessionsBeforeLongBreak === 0) {
        setSessionType('long-break');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setSessionType('break');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setSessionType('work');
      setTimeLeft(settings.workDuration * 60);
    }

    if (settings.soundEnabled) {
      playNotificationSound();
    }

    setSessionStartTime(null);
  };

  const getDuration = (type: 'work' | 'break' | 'long-break') => {
    switch (type) {
      case 'work':
        return settings.workDuration;
      case 'break':
        return settings.shortBreakDuration;
      case 'long-break':
        return settings.longBreakDuration;
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScSQwOUKfj77RfGwY7ktjyzX0uBSp+zPLaizsKGGS56+yjUxIOTKXh8bllHAU2jdXzzn0wBSh7y/HajDwKFF+16+qnVRQLRp/g8r1rHwUrgs/y2Yg2Bxlou/DmnEsMDFCn4+60XhoGO5LY8s5+LgUuf8zy24w7ChhluerqqFQTD06m4/G4ZBsGNYvU8tB+MAUngMvx2408ChRftujtp1URDEaf4O+/bR4GK4XP8dmJNQgXZ7zw5p1NDAxPpuPxtV4aBjqS2PLOfi4GLX/L8tyMOwkUX7bn7alUEw5Pp+PwuGQcCDSL1PLRfjAFJ4HM8dqNPAkUXrXn7KdUEgxGn+DvvmwdBiuFz/HZiTYHGGe98OadTQwMT6fi8bReGQY7ktfyz34vBS1/y/LcizwJFF+25+2nUxMPTqbj8LlkGwg0i9Ty0X4wBSeBzPDajTsJFF627+uoVRMNRp/g7r9rHQUrhdDx2Yk2BxhpvfDlnU0MDU+m4/C0XRkGPJPY8s9+LgUuf8zw3Iw6ChRftefsqFQTD06m4++5ZBsHNIvU8tB9MAUngcvw2o06CRVetefsp1QSDUaf3+6/bB4GK4XQ8dmINggZab3w5ZxNDA1Ppd/wtF4ZBjyT1/POf...');
    audio.play().catch(() => {});
  };

  const handleStartPause = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  const handleSkip = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionStartTime(null);
    setTimeLeft(getDuration(sessionType) * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (1 - timeLeft / (getDuration(sessionType) * 60)) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {!currentTask ? (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Task Selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select a task from your task list to start a focused work session
            </p>
            <button
              onClick={onTaskSelect}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Go to Tasks
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full mb-4">
                {sessionType === 'work' ? (
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Coffee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sessionType === 'work'
                    ? 'Focus Time'
                    : sessionType === 'long-break'
                    ? 'Long Break'
                    : 'Short Break'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentTask.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Session {sessionsCompleted + 1}
              </p>
            </div>

            <div className="relative mb-8">
              <div className="w-64 h-64 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333EA" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {Math.round(progress)}% complete
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Reset
              </button>
              <button
                onClick={handleStartPause}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Start</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSkip}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center space-x-2"
              >
                <SkipForward className="h-5 w-5" />
                <span>Skip</span>
              </button>
            </div>

            <div className="mt-8 flex justify-center space-x-2">
              {[...Array(settings.sessionsBeforeLongBreak)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < sessionsCompleted % settings.sessionsBeforeLongBreak
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
