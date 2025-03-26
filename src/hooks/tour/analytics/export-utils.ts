
import { TourAnalyticsData, TourAnalyticsExportOptions } from './types';
import { loadAnalyticsData, clearAnalyticsData } from './storage-service';

/**
 * Export analytics data as CSV
 * @param options Export options
 */
export const exportAnalyticsAsCsv = (options: TourAnalyticsExportOptions = {}): void => {
  const {
    filename = `tour-analytics-${new Date().toISOString().split('T')[0]}.csv`,
    clearAfterExport = false
  } = options;

  try {
    const data = loadAnalyticsData();
    
    if (data.length === 0) {
      console.warn('No analytics data to export');
      return;
    }

    // Get all possible headers
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    const headers = Array.from(allKeys);

    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...data.map(item => 
        headers.map(header => {
          const value = item[header as keyof TourAnalyticsData];
          if (value === undefined || value === null) return '';
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];

    // Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    if (clearAfterExport) {
      clearAnalyticsData();
    }
  } catch (error) {
    console.error('Failed to export analytics as CSV:', error);
  }
};

/**
 * Export analytics data as JSON
 * @param options Export options
 */
export const exportAnalyticsAsJson = (options: TourAnalyticsExportOptions = {}): void => {
  const {
    filename = `tour-analytics-${new Date().toISOString().split('T')[0]}.json`,
    clearAfterExport = false
  } = options;

  try {
    const data = loadAnalyticsData();
    
    if (data.length === 0) {
      console.warn('No analytics data to export');
      return;
    }

    // Create blob and download
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    if (clearAfterExport) {
      clearAnalyticsData();
    }
  } catch (error) {
    console.error('Failed to export analytics as JSON:', error);
  }
};
