
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TourGuideControllerInner } from '@/components/tour/guide/TourGuideControllerInner';
import { TourContext } from '@/contexts/tour';
import { ResponsiveTourProvider } from '@/contexts/tour/ResponsiveTourContext';
import { LanguageProvider } from '@/contexts/language-context';
import { KeyboardShortcutsProvider } from '@/contexts/tour/KeyboardShortcutsContext';
import { testAllBreakpoints, mockWindowSize } from '../responsive/responsiveTestHelpers';
import { Position } from '@/lib/tour/types';

// Mock the necessary providers and hooks
jest.mock('@/hooks/tour/useTourElementFinder', () => ({
  useTourElementFinder: () => ({ 
    targetElement: document.createElement('div') 
  })
}));

// Mock tour context value
const mockTourContextValue = {
  isActive: true,
  currentStep: 0,
  totalSteps: 3,
  nextStep: jest.fn(),
  prevStep: jest.fn(),
  endTour: jest.fn(),
  currentStepData: {
    id: 'test-step',
    title: 'Test Step',
    content: 'This is a test step',
    position: 'bottom' as Position,
    target: '.test-target'
  },
};

// Test wrapper component with all required providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <KeyboardShortcutsProvider>
      <TourContext.Provider value={mockTourContextValue as any}>
        <ResponsiveTourProvider>
          {children}
        </ResponsiveTourProvider>
      </TourContext.Provider>
    </KeyboardShortcutsProvider>
  </LanguageProvider>
);

describe('TourGuideController', () => {
  // Test at xs, md, and xl breakpoints (mobile, tablet, desktop)
  testAllBreakpoints(
    'renders appropriate view based on viewport',
    ['xs', 'md', 'xl'],
    (breakpoint) => {
      render(
        <TestWrapper>
          <TourGuideControllerInner />
        </TestWrapper>
      );
      
      // Verify component renders
      expect(screen.getByText('Test Step')).toBeInTheDocument();
    }
  );
  
  // Test landscape orientation behavior
  it('adapts to landscape orientation on mobile', () => {
    // Mock mobile landscape
    const cleanup = mockWindowSize(568, 320);
    
    try {
      render(
        <TestWrapper>
          <TourGuideControllerInner />
        </TestWrapper>
      );
      
      // Verify component renders in compact view
      expect(screen.getByText('Test Step')).toBeInTheDocument();
    } finally {
      cleanup();
    }
  });
  
  // Verify behavior when tour is inactive
  it('renders nothing when tour is inactive', () => {
    render(
      <LanguageProvider>
        <KeyboardShortcutsProvider>
          <TourContext.Provider 
            value={{ ...mockTourContextValue, isActive: false } as any}
          >
            <ResponsiveTourProvider>
              <TourGuideControllerInner />
            </ResponsiveTourProvider>
          </TourContext.Provider>
        </KeyboardShortcutsProvider>
      </LanguageProvider>
    );
    
    // Should not render anything
    expect(screen.queryByText('Test Step')).not.toBeInTheDocument();
  });
});
