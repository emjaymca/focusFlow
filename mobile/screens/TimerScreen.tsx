import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, PomodoroSession, AppSettings } from '../types';
import Svg, { Circle } from 'react-native-svg';

interface TimerScreenProps {
  currentTask: Task | null;
  settings: AppSettings;
  onComplete: (session: PomodoroSession) => void;
  onTaskSelect: () => void;
}

export default function TimerScreen({
  currentTask,
  settings,
  onComplete,
  onTaskSelect,
}: TimerScreenProps) {
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break' | 'long-break'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
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
        endTime: new Date().toISOString(),
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

  const handleStartPause = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsRunning(!isRunning);
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
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  if (!currentTask) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🧠</Text>
          <Text style={styles.emptyTitle}>No Task Selected</Text>
          <Text style={styles.emptyText}>
            Select a task from your task list to start a focused work session
          </Text>
          <TouchableOpacity style={styles.selectButton} onPress={onTaskSelect}>
            <Text style={styles.selectButtonText}>Go to Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.sessionBadge}>
          <Text style={styles.sessionType}>
            {sessionType === 'work'
              ? '🧠 Focus Time'
              : sessionType === 'long-break'
              ? '☕ Long Break'
              : '☕ Short Break'}
          </Text>
        </View>

        <Text style={styles.taskTitle}>{currentTask.title}</Text>
        <Text style={styles.sessionNumber}>Session {sessionsCompleted + 1}</Text>

        <View style={styles.circleContainer}>
          <Svg width={280} height={280}>
            <Circle
              cx={140}
              cy={140}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={12}
              fill="none"
            />
            <Circle
              cx={140}
              cy={140}
              r={radius}
              stroke="#9333EA"
              strokeWidth={12}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="140, 140"
            />
          </Svg>
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartPause}>
            <Text style={styles.primaryButtonText}>
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setTimeLeft(0)}>
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dots}>
          {[...Array(settings.sessionsBeforeLongBreak)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < sessionsCompleted % settings.sessionsBeforeLongBreak && styles.dotActive
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  selectButton: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  sessionBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionNumber: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  circleContainer: {
    position: 'relative',
    width: 280,
    height: 280,
    marginBottom: 32,
  },
  timerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#9333EA',
  },
});
