import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, StatusBar, SafeAreaView, AppState } from 'react-native';
import { Task, PomodoroSession, DailyGoal, UserStats, AppSettings } from './types';
import { loadFromStorage, saveToStorage, recordAppOpen, shouldShowMotivation, recordMotivationShown } from './utils/storage';
import { calculateStats } from './utils/stats';
import TasksScreen from './screens/TasksScreen';
import TimerScreen from './screens/TimerScreen';
import StatsScreen from './screens/StatsScreen';
import Header from './components/Header';
import MotivationModal from './components/MotivationModal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalTasksCompleted: 0,
    totalPomodoros: 0,
    totalFocusTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    tasksCompletedToday: 0,
    focusTimeToday: 0,
  });
  const [settings, setSettings] = useState<AppSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    soundEnabled: true,
    notificationsEnabled: true,
    theme: 'light',
  });
  
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [view, setView] = useState<'tasks' | 'timer' | 'stats'>('tasks');
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    loadData();
    checkAndShowMotivation();
    
    // Track when app comes to foreground
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'active') {
      await recordAppOpen();
      checkAndShowMotivation();
    }
  };

  const checkAndShowMotivation = async () => {
    const should = await shouldShowMotivation();
    if (should) {
      // Delay to let UI load
      setTimeout(() => {
        setShowMotivation(true);
      }, 1000);
    }
  };

  const handleMotivationClose = async () => {
    setShowMotivation(false);
    await recordMotivationShown();
  };

  const handleStartFocusFromMotivation = () => {
    setShowMotivation(false);
    if (currentTask) {
      setView('timer');
    } else {
      setView('tasks');
    }
  };

  const loadData = async () => {
    const savedTasks = await loadFromStorage<Task[]>('tasks');
    const savedSessions = await loadFromStorage<PomodoroSession[]>('sessions');
    const savedGoals = await loadFromStorage<DailyGoal[]>('dailyGoals');
    const savedSettings = await loadFromStorage<AppSettings>('settings');

    if (savedTasks) setTasks(savedTasks);
    if (savedSessions) setSessions(savedSessions);
    if (savedGoals) setDailyGoals(savedGoals);
    if (savedSettings) setSettings(savedSettings);
  };

  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('sessions', sessions);
  }, [sessions]);

  useEffect(() => {
    saveToStorage('dailyGoals', dailyGoals);
  }, [dailyGoals]);

  useEffect(() => {
    saveToStorage('settings', settings);
  }, [settings]);

  useEffect(() => {
    const newStats = calculateStats(tasks, sessions);
    setStats(newStats);
  }, [tasks, sessions]);

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            ...updates,
            completedAt: updates.status === 'completed' && !task.completedAt 
              ? new Date().toISOString()
              : task.completedAt 
          }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleCompletePomodoro = (session: PomodoroSession) => {
    setSessions([...sessions, session]);
    
    if (session.taskId && session.type === 'work' && session.completed) {
      const task = tasks.find(t => t.id === session.taskId);
      if (task) {
        const completedPomodoros = (task.completedPomodoros || 0) + 1;
        handleUpdateTask(session.taskId, { completedPomodoros });
      }
    }
  };

  const handleAddDailyGoal = (goal: Omit<DailyGoal, 'id'>) => {
    const newGoal: DailyGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setDailyGoals([...dailyGoals, newGoal]);
  };

  const handleUpdateDailyGoal = (goalId: string, updates: Partial<DailyGoal>) => {
    setDailyGoals(dailyGoals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        view={view} 
        onViewChange={setView} 
        stats={stats}
        onMotivationPress={() => setShowMotivation(true)}
      />
      
      <View style={styles.content}>
        {view === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            dailyGoals={dailyGoals}
            stats={stats}
            currentTask={currentTask}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onSelectTask={setCurrentTask}
            onAddDailyGoal={handleAddDailyGoal}
            onUpdateDailyGoal={handleUpdateDailyGoal}
          />
        )}

        {view === 'timer' && (
          <TimerScreen
            currentTask={currentTask}
            settings={settings}
            onComplete={handleCompletePomodoro}
            onTaskSelect={() => setView('tasks')}
          />
        )}

        {view === 'stats' && (
          <StatsScreen
            stats={stats}
            tasks={tasks}
            sessions={sessions}
            dailyGoals={dailyGoals}
          />
        )}
      </View>

      <MotivationModal
        visible={showMotivation}
        onClose={handleMotivationClose}
        stats={stats}
        currentTask={currentTask}
        onStartFocus={handleStartFocusFromMotivation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
});
