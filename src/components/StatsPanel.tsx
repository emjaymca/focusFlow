import React from 'react';
import { UserStats, Task, PomodoroSession, DailyGoal } from '../types';
import { TrendingUp, CheckCircle2, Clock, Flame, Award, Calendar } from 'lucide-react';

interface StatsPanelProps {
  stats: UserStats;
  tasks: Task[];
  sessions: PomodoroSession[];
  dailyGoals: DailyGoal[];
}

export default function StatsPanel({ stats, tasks, sessions, dailyGoals }: StatsPanelProps) {
  const completedTasksThisWeek = tasks.filter((task) => {
    if (!task.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(task.completedAt) > weekAgo;
  }).length;

  const sessionsThisWeek = sessions.filter((session) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(session.startTime) > weekAgo && session.completed;
  }).length;

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Statistics
        </h1>
        <div className="flex items-center space-x-2 text-orange-500">
          <Flame className="h-6 w-6" />
          <span className="text-2xl font-bold">{stats.currentStreak}</span>
          <span className="text-gray-600 dark:text-gray-400">day streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalTasksCompleted}</div>
          <div className="text-purple-200">Tasks Completed</div>
          <div className="text-sm text-purple-300 mt-2">
            {stats.tasksCompletedToday} today
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalPomodoros}</div>
          <div className="text-blue-200">Pomodoros</div>
          <div className="text-sm text-blue-300 mt-2">
            {formatMinutes(stats.totalFocusTime)} focus time
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-8 w-8 opacity-80" />
            <Award className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.longestStreak}</div>
          <div className="text-orange-200">Longest Streak</div>
          <div className="text-sm text-orange-300 mt-2">
            Current: {stats.currentStreak} days
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{formatMinutes(stats.focusTimeToday)}</div>
          <div className="text-green-200">Today's Focus</div>
          <div className="text-sm text-green-300 mt-2">
            Keep going!
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            This Week's Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {completedTasksThisWeek}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((completedTasksThisWeek / 20) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Focus Sessions</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sessionsThisWeek}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((sessionsThisWeek / 30) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-orange-500" />
            Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                🎯
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">First Task</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Complete your first task</div>
              </div>
              {stats.totalTasksCompleted > 0 && (
                <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                ⏱️
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Focus Master</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Complete 10 pomodoros</div>
              </div>
              {stats.totalPomodoros >= 10 && (
                <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                🔥
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Consistency King</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">7-day streak</div>
              </div>
              {stats.longestStreak >= 7 && (
                <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {sessions.slice(-5).reverse().map((session) => {
            const task = tasks.find((t) => t.id === session.taskId);
            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    session.type === 'work' ? 'bg-purple-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.type === 'work' ? 'Focus Session' : 'Break'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {task ? task.title : 'No task'}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(session.startTime).toLocaleDateString()}
                </div>
              </div>
            );
          })}
          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No sessions yet. Start your first pomodoro!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
