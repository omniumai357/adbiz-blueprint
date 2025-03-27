
import { useState, useCallback } from 'react';

interface TrackingEvent {
  type: string;
  timestamp: number;
  data: Record<string, any>;
}

interface TourStartData {
  pathId: string;
  tourId: string;
  tourName: string;
}

interface TourCompleteData extends TourStartData {
  totalSteps: number;
  userId: string;
  userType: string;
  metadata: Record<string, any>;
}

interface TourStepData extends TourStartData {
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}

interface StepNavigationData extends TourStepData {
  direction: 'next' | 'prev';
}

// Create unique session ID
const generateSessionId = () => {
  return `tour-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useTourAnalytics = () => {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [sessionId] = useState(generateSessionId());
  
  // Helper to add an event
  const addEvent = useCallback((type: string, data: Record<string, any>) => {
    const event: TrackingEvent = {
      type,
      timestamp: Date.now(),
      data: { ...data, sessionId }
    };
    
    setEvents(prev => [...prev, event]);
    console.log(`Tour Analytics [${type}]:`, data);
    
    return true; // Return true to indicate success
  }, [sessionId]);
  
  // Track tour started
  const trackTourStarted = useCallback((data: TourStartData) => {
    return addEvent('tour_started', {
      ...data,
      userId: 'anonymous', // Default values when not provided
      userType: 'guest'
    });
  }, [addEvent]);
  
  // Track tour completed
  const trackTourCompleted = useCallback((data: TourCompleteData) => {
    return addEvent('tour_completed', data);
  }, [addEvent]);
  
  // Track tour exited
  const trackTourExited = useCallback((data: TourStepData) => {
    return addEvent('tour_exited', data);
  }, [addEvent]);
  
  // Track tour paused
  const trackTourPaused = useCallback((data: TourStepData) => {
    return addEvent('tour_paused', data);
  }, [addEvent]);
  
  // Track step navigation
  const trackStepNavigation = useCallback((data: StepNavigationData) => {
    return addEvent('step_navigation', data);
  }, [addEvent]);
  
  // Track step view
  const trackStepView = useCallback((data: TourStepData) => {
    return addEvent('step_view', data);
  }, [addEvent]);
  
  // Track action click
  const trackActionClick = useCallback((data: TourStepData & { actionId: string }) => {
    return addEvent('action_click', data);
  }, [addEvent]);
  
  // Track custom event
  const trackCustomEvent = useCallback((eventName: string, data: Record<string, any>) => {
    return addEvent(`custom_${eventName}`, data);
  }, [addEvent]);
  
  // Export analytics data
  const exportAnalyticsAsJson = useCallback(() => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `tour-analytics-${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [events]);
  
  // Get session ID
  const getSessionId = useCallback(() => sessionId, [sessionId]);
  
  return {
    trackTourStarted,
    trackTourCompleted,
    trackTourExited,
    trackTourPaused,
    trackStepNavigation,
    trackStepView,
    trackActionClick,
    trackCustomEvent,
    getSessionId,
    exportAnalyticsAsJson
  };
};
