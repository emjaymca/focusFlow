import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { CheckCircle2, Circle, Clock, Trash2, Flag, Edit } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title: string;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  currentTaskId?: string;
}

export default function TaskList({
  tasks,
  title,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  currentTaskId,
}: TaskListProps) {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const toggleTaskStatus = (task: Task) => {
    if (task.status === 'completed') {
      onUpdateTask(task.id, { status: 'todo', completedAt: undefined });
    } else if (task.status === 'todo') {
      onUpdateTask(task.id, { status: 'in-progress' });
    } else {
      onUpdateTask(task.id, { status: 'completed' });
    }
  };

  if (tasks.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          ({tasks.length})
        </span>
      </h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
              currentTaskId === task.id
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                : 'border-gray-200 dark:border-gray-700'
            } ${
              task.status === 'completed'
                ? 'opacity-60'
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className="mt-1 focus:outline-none"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400 hover:text-purple-500" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-semibold text-gray-900 dark:text-white ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <Flag className="h-3 w-3 inline mr-1" />
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                  )}

                  {task.estimatedPomodoros && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>
                        {task.completedPomodoros || 0} / {task.estimatedPomodoros} pomodoros
                      </span>
                    </div>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => onSelectTask(task)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      currentTaskId === task.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}
                  >
                    {currentTaskId === task.id ? 'Selected' : 'Work on this'}
                  </button>
                )}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
