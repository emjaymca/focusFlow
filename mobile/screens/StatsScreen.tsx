import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { UserStats, Task, PomodoroSession, DailyGoal } from '../types';

interface StatsScreenProps {
  stats: UserStats;
  tasks: Task[];
  sessions: PomodoroSession[];
  dailyGoals: DailyGoal[];
}

export default function StatsScreen({ stats, tasks, sessions }: StatsScreenProps) {
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Statistics</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{stats.currentStreak} day streak</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.purpleCard]}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statValue}>{stats.totalTasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
          <Text style={styles.statSubtext}>{stats.tasksCompletedToday} today</Text>
        </View>

        <View style={[styles.statCard, styles.blueCard]}>
          <Text style={styles.statIcon}>⏱</Text>
          <Text style={styles.statValue}>{stats.totalPomodoros}</Text>
          <Text style={styles.statLabel}>Pomodoros</Text>
          <Text style={styles.statSubtext}>{formatMinutes(stats.totalFocusTime)} focus</Text>
        </View>

        <View style={[styles.statCard, styles.orangeCard]}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{stats.longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
          <Text style={styles.statSubtext}>Current: {stats.currentStreak}</Text>
        </View>

        <View style={[styles.statCard, styles.greenCard]}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statValue}>{formatMinutes(stats.focusTimeToday)}</Text>
          <Text style={styles.statLabel}>Today's Focus</Text>
          <Text style={styles.statSubtext}>Keep going!</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 This Week's Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Tasks Completed</Text>
            <Text style={styles.progressValue}>{completedTasksThisWeek}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  styles.purpleFill,
                  { width: `${Math.min((completedTasksThisWeek / 20) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Focus Sessions</Text>
            <Text style={styles.progressValue}>{sessionsThisWeek}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  styles.blueFill,
                  { width: `${Math.min((sessionsThisWeek / 30) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>
        
        <View style={[
          styles.achievementCard,
          stats.totalTasksCompleted > 0 && styles.achievementUnlocked
        ]}>
          <Text style={styles.achievementIcon}>🎯</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>First Task</Text>
            <Text style={styles.achievementDesc}>Complete your first task</Text>
          </View>
          {stats.totalTasksCompleted > 0 && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>

        <View style={[
          styles.achievementCard,
          stats.totalPomodoros >= 10 && styles.achievementUnlocked
        ]}>
          <Text style={styles.achievementIcon}>⏱️</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Focus Master</Text>
            <Text style={styles.achievementDesc}>Complete 10 pomodoros</Text>
          </View>
          {stats.totalPomodoros >= 10 && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>

        <View style={[
          styles.achievementCard,
          stats.longestStreak >= 7 && styles.achievementUnlocked
        ]}>
          <Text style={styles.achievementIcon}>🔥</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Consistency King</Text>
            <Text style={styles.achievementDesc}>7-day streak</Text>
          </View>
          {stats.longestStreak >= 7 && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {sessions.length === 0 ? (
          <Text style={styles.emptyText}>No sessions yet. Start your first pomodoro!</Text>
        ) : (
          sessions.slice(-5).reverse().map((session) => {
            const task = tasks.find((t) => t.id === session.taskId);
            return (
              <View key={session.id} style={styles.activityCard}>
                <View style={[
                  styles.activityDot,
                  session.type === 'work' ? styles.purpleDot : styles.blueDot
                ]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    {session.type === 'work' ? 'Focus Session' : 'Break'}
                  </Text>
                  <Text style={styles.activitySubtext}>
                    {task ? task.title : 'No task'}
                  </Text>
                </View>
                <Text style={styles.activityDate}>
                  {new Date(session.startTime).toLocaleDateString()}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purpleCard: {
    backgroundColor: '#9333EA',
  },
  blueCard: {
    backgroundColor: '#2563EB',
  },
  orangeCard: {
    backgroundColor: '#F97316',
  },
  greenCard: {
    backgroundColor: '#10B981',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
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
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  purpleFill: {
    backgroundColor: '#9333EA',
  },
  blueFill: {
    backgroundColor: '#2563EB',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementUnlocked: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkmark: {
    fontSize: 20,
    color: '#10B981',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  purpleDot: {
    backgroundColor: '#9333EA',
  },
  blueDot: {
    backgroundColor: '#2563EB',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: 32,
  },
});
