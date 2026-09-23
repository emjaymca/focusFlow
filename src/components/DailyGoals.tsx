import React, { useState } from 'react';
import { DailyGoal, UserStats } from '../types';
import { Target, Plus, CheckCircle2, TrendingUp } from 'lucide-react';

interface DailyGoalsProps {
  goals: DailyGoal[];
  onAddGoal: (goal: Omit<DailyGoal, 'id'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<DailyGoal>) => void;
  stats: UserStats;
}

export default function DailyGoals({ goals, onAddGoal, onUpdateGoal, stats }: DailyGoalsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(3);

  const today = new Date().toDateString();
  const todayGoals = goals.filter((goal) => new Date(goal.date).toDateString() === today);

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      onAddGoal({
        title: newGoalTitle,
        target: newGoalTarget,
        current: 0,
        date: new Date(),
        completed: false,
      });
      setNewGoalTitle('');
      setNewGoalTarget(3);
      setIsAdding(false);
    }
  };

  const incrementGoal = (goal: DailyGoal) => {
    const newCurrent = goal.current + 1;
    onUpdateGoal(goal.id, {
      current: newCurrent,
      completed: newCurrent >= goal.target,
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Target className="h-6 w-6 mr-2 text-purple-600" />
          Today's Goals
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Goal title (e.g., 'Complete 3 tasks')"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
          />
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Target:</label>
            <input
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 1)}
              min="1"
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddGoal}
              className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {todayGoals.length === 0 ? (
        <div className="text-center py-6 text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No goals set for today. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg transition-all ${
                goal.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {goal.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Target className="h-5 w-5 text-purple-600" />
                  )}
                  <span className={`font-semibold ${
                    goal.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'
                  }`}>
                    {goal.title}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  goal.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {goal.current} / {goal.target}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    goal.completed
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                />
              </div>

              {!goal.completed && (
                <button
                  onClick={() => incrementGoal(goal)}
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  + Increment
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tasks completed today:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {stats.tasksCompletedToday}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">Focus time today:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {Math.round(stats.focusTimeToday)} min
          </span>
        </div>
      </div>
    </div>
  );
}
