import { Task, PomodoroSession, UserStats } from '../types';

export function calculateStats(tasks: Task[], sessions: PomodoroSession[]): UserStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const totalTasksCompleted = completedTasks.length;

  const completedSessions = sessions.filter((s) => s.completed && s.type === 'work');
  const totalPomodoros = completedSessions.length;

  const totalFocusTime = completedSessions.reduce((sum, session) => sum + session.duration, 0);

  const tasksCompletedToday = completedTasks.filter((task) => {
    if (!task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    completedDate.setHours(0, 0, 0, 0);
    return completedDate.getTime() === today.getTime();
  }).length;

  const todaySessions = completedSessions.filter((session) => {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  const focusTimeToday = todaySessions.reduce((sum, session) => sum + session.duration, 0);

  const { currentStreak, longestStreak } = calculateStreaks(completedTasks);

  return {
    totalTasksCompleted,
    totalPomodoros,
    totalFocusTime,
    currentStreak,
    longestStreak,
    tasksCompletedToday,
    focusTimeToday,
  };
}

function calculateStreaks(completedTasks: Task[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (completedTasks.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const tasksByDate = new Map<string, Task[]>();
  completedTasks.forEach((task) => {
    if (task.completedAt) {
      const date = new Date(task.completedAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!tasksByDate.has(dateKey)) {
        tasksByDate.set(dateKey, []);
      }
      tasksByDate.get(dateKey)!.push(task);
    }
  });

  const sortedDates = Array.from(tasksByDate.keys()).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = today.toISOString().split('T')[0];
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const currentDate = sortedDates[i];
    
    if (i === sortedDates.length - 1) {
      if (currentDate === todayKey || currentDate === yesterdayKey) {
        tempStreak = 1;
        if (currentDate === todayKey || currentDate === yesterdayKey) {
          currentStreak = 1;
        }
      } else {
        break;
      }
    } else {
      const prevDate = sortedDates[i + 1];
      const currentDateObj = new Date(currentDate);
      const prevDateObj = new Date(prevDate);
      
      const diffTime = prevDateObj.getTime() - currentDateObj.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
        if (currentStreak > 0) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (currentStreak > 0) {
          break;
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}
