
import { TourAnalyticsData } from './types';

/**
 * Stores analytics data in localStorage
 * @param data Analytics data to store
 */
export const storeAnalyticsData = (data: TourAnalyticsData): void => {
  try {
    const existingData = localStorage.getItem('tourAnalytics');
    const analyticsArray = existingData ? JSON.parse(existingData) : [];
    analyticsArray.push(data);
    localStorage.setItem('tourAnalytics', JSON.stringify(analyticsArray));
  } catch (error) {
    console.error('Failed to store tour analytics:', error);
  }
};

/**
 * Loads tour analytics data from storage
 * @returns Array of analytics events or empty array if none found
 */
export const loadAnalyticsData = (): TourAnalyticsData[] => {
  try {
    const storedData = localStorage.getItem('tourAnalytics');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Failed to load analytics data:', error);
    return [];
  }
};

/**
 * Clears all stored tour analytics data
 * @returns True if successful, false otherwise
 */
export const clearAnalyticsData = (): boolean => {
  try {
    localStorage.removeItem('tourAnalytics');
    return true;
  } catch (error) {
    console.error('Failed to clear analytics data:', error);
    return false;
  }
};
