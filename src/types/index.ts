export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  tags?: string[];
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  completed: boolean;
  type: 'work' | 'break' | 'long-break';
}

export interface DailyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  date: Date;
  completed: boolean;
}

export interface UserStats {
  totalTasksCompleted: number;
  totalPomodoros: number;
  totalFocusTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
  focusTimeToday: number;
}

export interface AppSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}
