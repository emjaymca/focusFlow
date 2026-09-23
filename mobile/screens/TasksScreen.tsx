import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Task, DailyGoal, UserStats, TaskPriority } from '../types';

interface TasksScreenProps {
  tasks: Task[];
  dailyGoals: DailyGoal[];
  stats: UserStats;
  currentTask: Task | null;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onAddDailyGoal: (goal: Omit<DailyGoal, 'id'>) => void;
  onUpdateDailyGoal: (goalId: string, updates: Partial<DailyGoal>) => void;
}

export default function TasksScreen({
  tasks,
  dailyGoals,
  stats,
  currentTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onAddDailyGoal,
  onUpdateDailyGoal,
}: TasksScreenProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState('2');

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask({
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        priority: taskPriority,
        status: 'todo',
        estimatedPomodoros: parseInt(estimatedPomodoros) || undefined,
        completedPomodoros: 0,
      });
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setEstimatedPomodoros('2');
      setIsAddModalOpen(false);
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

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
    }
  };

  const renderTask = (task: Task) => (
    <View
      key={task.id}
      style={[
        styles.taskCard,
        currentTask?.id === task.id && styles.taskCardSelected
      ]}
    >
      <View style={styles.taskHeader}>
        <TouchableOpacity onPress={() => toggleTaskStatus(task)}>
          <View style={[
            styles.checkbox,
            task.status === 'completed' && styles.checkboxCompleted
          ]}>
            {task.status === 'completed' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
            task.status === 'completed' && styles.taskTitleCompleted
          ]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={styles.taskDescription}>{task.description}</Text>
          )}
          {task.estimatedPomodoros && (
            <Text style={styles.pomodoros}>
              🍅 {task.completedPomodoros || 0} / {task.estimatedPomodoros}
            </Text>
          )}
        </View>

        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
          <Text style={styles.priorityText}>{task.priority[0].toUpperCase()}</Text>
        </View>
      </View>

      {task.status !== 'completed' && (
        <TouchableOpacity
          style={[
            styles.workButton,
            currentTask?.id === task.id && styles.workButtonSelected
          ]}
          onPress={() => onSelectTask(task)}
        >
          <Text style={styles.workButtonText}>
            {currentTask?.id === task.id ? 'Selected' : 'Work on this'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteTask(task.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tasks</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddModalOpen(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Today's Progress</Text>
          <Text style={styles.statsText}>
            Tasks completed: {stats.tasksCompletedToday}
          </Text>
          <Text style={styles.statsText}>
            Focus time: {Math.round(stats.focusTimeToday)} min
          </Text>
        </View>

        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Tasks ({activeTasks.length})</Text>
            {activeTasks.map(renderTask)}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed ({completedTasks.length})</Text>
            {completedTasks.map(renderTask)}
          </View>
        )}
      </ScrollView>

      <Modal visible={isAddModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task title *"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    taskPriority === p && { backgroundColor: getPriorityColor(p) }
                  ]}
                  onPress={() => setTaskPriority(p)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    taskPriority === p && styles.priorityButtonTextActive
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Estimated Pomodoros</Text>
            <TextInput
              style={styles.input}
              placeholder="2"
              value={estimatedPomodoros}
              onChangeText={setEstimatedPomodoros}
              keyboardType="number-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddModalOpen(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddTask}
              >
                <Text style={styles.submitButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#DDD6FE',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  taskCardSelected: {
    borderColor: '#9333EA',
    backgroundColor: '#F5F3FF',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  pomodoros: {
    fontSize: 12,
    color: '#6B7280',
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  workButton: {
    backgroundColor: '#EDE9FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  workButtonSelected: {
    backgroundColor: '#9333EA',
  },
  workButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  priorityButtonTextActive: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#9333EA',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
