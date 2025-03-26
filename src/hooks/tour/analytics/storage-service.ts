
import { TourAnalyticsData } from './types';

const STORAGE_KEY = 'tourAnalytics';

/**
 * Store analytics data in localStorage
 * @param data The analytics data to store
 */
export const storeAnalyticsData = (data: TourAnalyticsData): void => {
  try {
    // Load existing data
    const existingData = loadAnalyticsData();
    
    // Add new data
    const updatedData = [...existingData, data];
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to store analytics data:', error);
  }
};

/**
 * Load analytics data from localStorage
 * @returns Array of stored analytics data
 */
export const loadAnalyticsData = (): TourAnalyticsData[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Failed to load analytics data:', error);
    return [];
  }
};

/**
 * Clear all stored analytics data
 */
export const clearAnalyticsData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear analytics data:', error);
  }
};
