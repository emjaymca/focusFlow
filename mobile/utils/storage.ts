import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadFromStorage<T>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return null;
  }
}

export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

export async function clearStorage(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${key} from storage:`, error);
  }
}

// Track app usage patterns
export async function recordAppOpen(): Promise<void> {
  const now = new Date().toISOString();
  await saveToStorage('lastAppOpen', now);
  
  // Get open history
  const history = await loadFromStorage<string[]>('appOpenHistory') || [];
  history.push(now);
  
  // Keep only last 50 opens
  const recent = history.slice(-50);
  await saveToStorage('appOpenHistory', recent);
}

export async function getTimeSinceLastOpen(): Promise<number> {
  const lastOpen = await loadFromStorage<string>('lastAppOpen');
  if (!lastOpen) return Infinity;
  
  const lastOpenTime = new Date(lastOpen).getTime();
  const now = new Date().getTime();
  return now - lastOpenTime;
}

export async function shouldShowMotivation(): Promise<boolean> {
  const timeSince = await getTimeSinceLastOpen();
  const lastMotivation = await loadFromStorage<string>('lastMotivationShown');
  
  // Always show if been away for more than 5 minutes (likely social media!)
  if (timeSince > 5 * 60 * 1000) return true;
  
  // Or if no motivation shown in last 2 hours
  if (lastMotivation) {
    const lastMotivationTime = new Date(lastMotivation).getTime();
    const now = new Date().getTime();
    if (now - lastMotivationTime > 2 * 60 * 60 * 1000) return true;
  } else {
    // First time user, show motivation
    return true;
  }
  
  return false;
}

export async function recordMotivationShown(): Promise<void> {
  await saveToStorage('lastMotivationShown', new Date().toISOString());
}
