
import { TourAnalyticsData } from './types';
import { loadAnalyticsData, clearAnalyticsData } from './storage-service';

/**
 * Exports tour analytics data as a CSV file
 */
export function exportAnalyticsAsCsv(): void {
  const data = loadAnalyticsData();
  
  if (data.length === 0) {
    alert('No analytics data to export');
    return;
  }
  
  // Get all possible keys from all objects
  const allKeys = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
    if (item.metadata) {
      Object.keys(item.metadata).forEach(key => allKeys.add(`metadata_${key}`));
    }
  });
  
  // Convert to array and sort for consistent output
  const headers = Array.from(allKeys).sort();
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      if (header.startsWith('metadata_') && item.metadata) {
        const metadataKey = header.replace('metadata_', '');
        return JSON.stringify(item.metadata[metadataKey] || '');
      } else if (header === 'metadata') {
        return JSON.stringify(item.metadata || {});
      } else {
        const value = (item as any)[header];
        return JSON.stringify(value !== undefined ? value : '');
      }
    });
    
    csv += row.join(',') + '\n';
  });
  
  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `tour-analytics-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Exports tour analytics data as a JSON file
 */
export function exportAnalyticsAsJson(): void {
  const data = loadAnalyticsData();
  
  if (data.length === 0) {
    alert('No analytics data to export');
    return;
  }
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `tour-analytics-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
