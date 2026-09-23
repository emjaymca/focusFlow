import React from 'react';
import { CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  view: 'tasks' | 'timer' | 'stats';
  onViewChange: (view: 'tasks' | 'timer' | 'stats') => void;
  stats: UserStats;
}

export default function Header({ view, onViewChange, stats }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                FocusFlow
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Beat Procrastination
              </p>
            </div>
          </div>

          <nav className="flex space-x-2">
            <button
              onClick={() => onViewChange('tasks')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'tasks'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Tasks</span>
              </div>
            </button>

            <button
              onClick={() => onViewChange('timer')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'timer'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Timer</span>
              </div>
            </button>

            <button
              onClick={() => onViewChange('stats')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'stats'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Stats</span>
              </div>
            </button>
          </nav>

          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">day streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.tasksCompletedToday}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">done today</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
