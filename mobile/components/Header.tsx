import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserStats } from '../types';

interface HeaderProps {
  view: 'tasks' | 'timer' | 'stats';
  onViewChange: (view: 'tasks' | 'timer' | 'stats') => void;
  stats: UserStats;
  onMotivationPress: () => void;
}

export default function Header({ view, onViewChange, stats, onMotivationPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <View>
            <Text style={styles.title}>FocusFlow</Text>
            <Text style={styles.subtitle}>Beat Procrastination</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.motivationButton}
          onPress={onMotivationPress}
        >
          <Text style={styles.motivationEmoji}>✨</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => onViewChange('tasks')}
          style={[styles.navButton, view === 'tasks' && styles.navButtonActive]}
        >
          <Text style={[styles.navText, view === 'tasks' && styles.navTextActive]}>
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onViewChange('timer')}
          style={[styles.navButton, view === 'timer' && styles.navButtonActive]}
        >
          <Text style={[styles.navText, view === 'timer' && styles.navTextActive]}>
            Timer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onViewChange('stats')}
          style={[styles.navButton, view === 'stats' && styles.navButtonActive]}
        >
          <Text style={[styles.navText, view === 'stats' && styles.navTextActive]}>
            Stats
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.tasksCompletedToday}</Text>
          <Text style={styles.statLabel}>today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  motivationButton: {
    backgroundColor: '#F5F3FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  motivationEmoji: {
    fontSize: 24,
  },
  nav: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#9333EA',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  navTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
});
