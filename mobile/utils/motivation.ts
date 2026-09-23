import { Task } from '../types';

// Fallback motivational quotes if AI is unavailable
const FALLBACK_QUOTES = [
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  },
  {
    quote: "Small progress is still progress. Keep going!",
    author: "Anonymous"
  },
  {
    quote: "You are capable of amazing things when you focus.",
    author: "Anonymous"
  },
  {
    quote: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  }
];

interface MotivationalQuote {
  quote: string;
  author: string;
  context?: string;
}

export async function getAIMotivationalQuote(
  context?: {
    tasksCompleted: number;
    currentTask?: Task;
    streak: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
  }
): Promise<MotivationalQuote> {
  try {
    // Try to get AI-generated quote
    const aiQuote = await fetchAIQuote(context);
    if (aiQuote) return aiQuote;
  } catch (error) {
    console.log('AI quote unavailable, using fallback');
  }
  
  // Fallback to curated quotes
  return getContextualFallbackQuote(context);
}

async function fetchAIQuote(context?: any): Promise<MotivationalQuote | null> {
  // This would integrate with an AI service like OpenAI, Claude, or Gemini
  // For now, we'll use a simple approach that mimics AI behavior
  
  try {
    // Simulate AI API call with personalized context
    if (context) {
      const { tasksCompleted, currentTask, streak, timeOfDay } = context;
      
      // Generate contextual quote based on user's situation
      if (streak >= 7) {
        return {
          quote: `${streak} days of consistency! You're building incredible habits. Your dedication is transforming procrastination into productivity. Keep this momentum!`,
          author: "FocusFlow AI",
          context: "streak"
        };
      }
      
      if (tasksCompleted === 0 && timeOfDay === 'evening') {
        return {
          quote: "It's not too late to start. Even one small task completed today is a victory. What's the smallest thing you can do right now?",
          author: "FocusFlow AI",
          context: "evening_no_tasks"
        };
      }
      
      if (tasksCompleted >= 3) {
        return {
          quote: `${tasksCompleted} tasks done! You're crushing it today. Your focus is paying off. Keep this energy going!`,
          author: "FocusFlow AI",
          context: "high_completion"
        };
      }
      
      if (currentTask) {
        return {
          quote: `"${currentTask.title}" is waiting for you. Break it down into tiny steps. Just 5 minutes of focus can build serious momentum.`,
          author: "FocusFlow AI",
          context: "active_task"
        };
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

function getContextualFallbackQuote(context?: any): MotivationalQuote {
  if (!context) {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
  
  const { tasksCompleted, streak, timeOfDay } = context;
  
  // Filter quotes based on context
  let filteredQuotes = [...FALLBACK_QUOTES];
  
  if (tasksCompleted >= 3) {
    // High achiever today
    filteredQuotes = FALLBACK_QUOTES.slice(5, 8);
  } else if (streak >= 5) {
    // Good streak
    filteredQuotes = FALLBACK_QUOTES.slice(2, 5);
  } else if (timeOfDay === 'morning') {
    // Morning motivation
    filteredQuotes = FALLBACK_QUOTES.slice(0, 3);
  }
  
  return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function getAntiProcrastinationTip(): string {
  const tips = [
    "🎯 Try the 2-minute rule: If a task takes less than 2 minutes, do it now!",
    "🧠 Break large tasks into tiny, manageable steps",
    "⏰ Set a timer for just 5 minutes of focused work",
    "📱 Put your phone in another room while working",
    "✅ Complete the hardest task first thing in the morning",
    "🎵 Use background noise or focus music to enhance concentration",
    "☕ Take short breaks every 25 minutes (Pomodoro!)",
    "📝 Write down exactly what you'll do before starting",
    "🏆 Reward yourself after completing tasks",
    "🔄 Build consistency by working at the same time daily"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

export function getFocusReminder(context?: { timeAway?: number }): string {
  const { timeAway = 0 } = context || {};
  const minutesAway = Math.floor(timeAway / (1000 * 60));
  
  // If they were away for a significant time, give stronger reminders
  if (minutesAway > 30) {
    const strongReminders = [
      `📱 You've been away for ${minutesAway} minutes. Social media can wait. Your goals can't.`,
      `⏱️ ${minutesAway} minutes lost to scrolling. Let's make the next 25 count!`,
      `🎯 Those ${minutesAway} minutes could have been a completed Pomodoro. Start one NOW!`,
      `💪 ${minutesAway} minutes gone. But you're back now. That's what matters. Focus!`,
      `🚀 Stop scrolling, start doing. Your future self is begging you to focus now.`,
    ];
    return strongReminders[Math.floor(Math.random() * strongReminders.length)];
  }
  
  const reminders = [
    "📱 Social media can wait. Your goals can't.",
    "⏱️ You're losing precious time. Start a Pomodoro now!",
    "🎯 Every scroll is a minute away from your dreams.",
    "💪 You're stronger than your distractions.",
    "🚀 Your future self will thank you for focusing now.",
    "⚡ 25 minutes of focus > 3 hours of distraction.",
    "🎨 Create instead of consume. Build instead of browse.",
    "🔥 Your streak is counting on you!",
    "✨ Small focused actions lead to big results.",
    "🌟 You opened this app for a reason. Let's get to work!"
  ];
  
  return reminders[Math.floor(Math.random() * reminders.length)];
}

export function getSocialMediaWarning(minutesAway: number): string {
  if (minutesAway < 5) {
    return "Quick check turned into a long scroll? Let's refocus.";
  } else if (minutesAway < 15) {
    return `${minutesAway} minutes vanished. Time to reclaim your focus.`;
  } else if (minutesAway < 30) {
    return `${minutesAway} minutes lost to the scroll. Your tasks are waiting.`;
  } else if (minutesAway < 60) {
    return `${minutesAway} minutes gone. That's a whole Pomodoro session wasted!`;
  } else {
    const hours = Math.floor(minutesAway / 60);
    const mins = minutesAway % 60;
    return `${hours}h ${mins}m away. Imagine what you could have accomplished!`;
  }
}
