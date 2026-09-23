import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { getAIMotivationalQuote, getTimeOfDay, getAntiProcrastinationTip, getFocusReminder, getSocialMediaWarning } from '../utils/motivation';
import { getTimeSinceLastOpen } from '../utils/storage';
import { Task, UserStats } from '../types';

interface MotivationModalProps {
  visible: boolean;
  onClose: () => void;
  stats: UserStats;
  currentTask?: Task | null;
  onStartFocus?: () => void;
}

export default function MotivationModal({ visible, onClose, stats, currentTask, onStartFocus }: MotivationModalProps) {
  const [quote, setQuote] = useState<{ quote: string; author: string; context?: string } | null>(null);
  const [tip, setTip] = useState<string>('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [timeAway, setTimeAway] = useState(0);
  const [socialMediaWarning, setSocialMediaWarning] = useState<string>('');

  useEffect(() => {
    if (visible) {
      loadMotivation();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const loadMotivation = async () => {
    setLoading(true);
    
    // Get time since last open
    const timeSince = await getTimeSinceLastOpen();
    setTimeAway(timeSince);
    
    const minutesAway = Math.floor(timeSince / (1000 * 60));
    
    // Show social media warning if they were away
    if (minutesAway >= 5) {
      setSocialMediaWarning(getSocialMediaWarning(minutesAway));
    }
    
    const timeOfDay = getTimeOfDay();
    const context = {
      tasksCompleted: stats.tasksCompletedToday,
      currentTask: currentTask || undefined,
      streak: stats.currentStreak,
      timeOfDay,
    };

    const motivationalQuote = await getAIMotivationalQuote(context);
    const antiProcrastinationTip = getAntiProcrastinationTip();

    setQuote(motivationalQuote);
    setTip(antiProcrastinationTip);
    setLoading(false);
  };

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const refreshQuote = () => {
    loadMotivation();
  };

  const handleStartFocus = () => {
    handleClose();
    if (onStartFocus) {
      onStartFocus();
    }
  };

  const minutesAway = Math.floor(timeAway / (1000 * 60));
  const showTimeAway = minutesAway >= 5;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>✨</Text>
            <Text style={styles.headerTitle}>Stay Focused</Text>
            <Text style={styles.headerEmoji}>✨</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Generating motivation...</Text>
            </View>
          ) : (
            <>
              {showTimeAway && socialMediaWarning && (
                <View style={styles.warningBanner}>
                  <Text style={styles.warningEmoji}>⚠️</Text>
                  <Text style={styles.warningText}>{socialMediaWarning}</Text>
                </View>
              )}

              <View style={styles.quoteContainer}>
                <Text style={styles.quoteIcon}>"</Text>
                <Text style={styles.quoteText}>{quote?.quote}</Text>
                <Text style={styles.quoteAuthor}>— {quote?.author}</Text>
              </View>

              <View style={styles.tipContainer}>
                <Text style={styles.tipTitle}>💡 Pro Tip</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.currentStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak 🔥</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.tasksCompletedToday}</Text>
                  <Text style={styles.statLabel}>Done Today ✅</Text>
                </View>
              </View>

              <View style={styles.reminder}>
                <Text style={styles.reminderText}>{getFocusReminder({ timeAway })}</Text>
              </View>

              <View style={styles.actions}>
                {currentTask && onStartFocus ? (
                  <TouchableOpacity style={styles.primaryButtonLarge} onPress={handleStartFocus}>
                    <Text style={styles.primaryButtonText}>🚀 Start Pomodoro NOW!</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.primaryButtonLarge} onPress={handleClose}>
                    <Text style={styles.primaryButtonText}>Let's Focus! 💪</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity style={styles.refreshButton} onPress={refreshQuote}>
                <Text style={styles.refreshButtonText}>🔄 New Quote</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  quoteContainer: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
  },
  quoteIcon: {
    fontSize: 48,
    color: '#9333EA',
    opacity: 0.3,
    lineHeight: 48,
  },
  quoteText: {
    fontSize: 18,
    color: '#111827',
    lineHeight: 28,
    fontStyle: 'italic',
    marginVertical: 12,
  },
  quoteAuthor: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '600',
  },
  tipContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  reminder: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  reminderText: {
    fontSize: 15,
    color: '#1E40AF',
    fontWeight: '600',
    textAlign: 'center',
  },
  warningBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 16,
    color: '#991B1B',
    fontWeight: 'bold',
  },
  actions: {
    marginBottom: 12,
  },
  primaryButtonLarge: {
    backgroundColor: '#9333EA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
