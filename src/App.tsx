import React, { useState, useEffect } from 'react';
import { Task, PomodoroSession, DailyGoal, UserStats, AppSettings, TaskStatus } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import StatsPanel from './components/StatsPanel';
import DailyGoals from './components/DailyGoals';
import AddTaskModal from './components/AddTaskModal';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import { calculateStats } from './utils/stats';

function App() {
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
  
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [view, setView] = useState<'tasks' | 'timer' | 'stats'>('tasks');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = loadFromLocalStorage<Task[]>('tasks');
    const savedSessions = loadFromLocalStorage<PomodoroSession[]>('sessions');
    const savedGoals = loadFromLocalStorage<DailyGoal[]>('dailyGoals');
    const savedSettings = loadFromLocalStorage<AppSettings>('settings');

    if (savedTasks) setTasks(savedTasks);
    if (savedSessions) setSessions(savedSessions);
    if (savedGoals) setDailyGoals(savedGoals);
    if (savedSettings) setSettings(savedSettings);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    saveToLocalStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToLocalStorage('sessions', sessions);
  }, [sessions]);

  useEffect(() => {
    saveToLocalStorage('dailyGoals', dailyGoals);
  }, [dailyGoals]);

  useEffect(() => {
    saveToLocalStorage('settings', settings);
  }, [settings]);

  // Calculate stats whenever tasks or sessions change
  useEffect(() => {
    const newStats = calculateStats(tasks, sessions);
    setStats(newStats);
  }, [tasks, sessions]);

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setIsAddTaskModalOpen(false);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            ...updates,
            completedAt: updates.status === 'completed' && !task.completedAt 
              ? new Date() 
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

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'}`}>
      <Header 
        view={view} 
        onViewChange={setView}
        stats={stats}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Tasks
              </h1>
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                + Add Task
              </button>
            </div>

            <DailyGoals
              goals={dailyGoals}
              onAddGoal={handleAddDailyGoal}
              onUpdateGoal={handleUpdateDailyGoal}
              stats={stats}
            />

            <TaskList
              tasks={activeTasks}
              title="Active Tasks"
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onSelectTask={setCurrentTask}
              currentTaskId={currentTask?.id}
            />

            {completedTasks.length > 0 && (
              <TaskList
                tasks={completedTasks}
                title="Completed Tasks"
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onSelectTask={setCurrentTask}
                currentTaskId={currentTask?.id}
              />
            )}
          </div>
        )}

        {view === 'timer' && (
          <PomodoroTimer
            currentTask={currentTask}
            settings={settings}
            onComplete={handleCompletePomodoro}
            onTaskSelect={() => setView('tasks')}
          />
        )}

        {view === 'stats' && (
          <StatsPanel
            stats={stats}
            tasks={tasks}
            sessions={sessions}
            dailyGoals={dailyGoals}
          />
        )}
      </main>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}

export default App;
