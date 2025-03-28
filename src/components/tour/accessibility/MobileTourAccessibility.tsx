
import React, { useEffect, useRef } from 'react';
import { useTour } from '@/contexts/tour';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';

interface MobileTourAccessibilityProps {
  isActive: boolean;
  isPortrait: boolean;
}

/**
 * MobileTourAccessibility Component
 * 
 * Handles accessibility concerns specific to mobile devices during tour.
 * - Prevents background scrolling
 * - Manages touch events
 * - Handles focus for screen readers
 * - Manages overlay behavior
 */
export const MobileTourAccessibility: React.FC<MobileTourAccessibilityProps> = ({
  isActive,
  isPortrait
}) => {
  const { currentStepData } = useTour();
  const { prefersReducedMotion } = useResponsiveTour();
  
  // Store original body overflow style
  const originalStyle = useRef<{
    overflow: string;
    position: string;
    top: string;
    width: string;
    paddingRight: string;
  }>({
    overflow: '',
    position: '',
    top: '',
    width: '',
    paddingRight: ''
  });
  
  // Store scroll position
  const scrollY = useRef<number>(0);
  
  // Prevent background scrolling when tour is active in portrait mode
  useEffect(() => {
    if (isActive && isPortrait) {
      // Save current styles
      originalStyle.current.overflow = document.body.style.overflow;
      originalStyle.current.position = document.body.style.position;
      originalStyle.current.top = document.body.style.top;
      originalStyle.current.width = document.body.style.width;
      originalStyle.current.paddingRight = document.body.style.paddingRight;
      
      // Save current scroll position
      scrollY.current = window.scrollY;
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = '100%';
      
      // Add padding right to prevent layout shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        // Re-enable scrolling when component unmounts
        document.body.style.overflow = originalStyle.current.overflow;
        document.body.style.position = originalStyle.current.position;
        document.body.style.top = originalStyle.current.top;
        document.body.style.width = originalStyle.current.width;
        document.body.style.paddingRight = originalStyle.current.paddingRight;
        
        // Restore scroll position
        window.scrollTo(0, scrollY.current);
      };
    }
  }, [isActive, isPortrait]);
  
  // Add ARIA live announcements for mobile tours
  useEffect(() => {
    if (isActive && currentStepData) {
      // Only create the announcement element if it doesn't exist
      let liveRegion = document.getElementById('tour-announcer');
      
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'tour-announcer';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
      }
      
      // For mobile devices, announce the entire tour content
      const mobileAnnouncement = `Tour step ${currentStepData.title}. ${currentStepData.content}`;
      
      // Use a small delay to ensure screen readers catch the change
      const timeoutId = setTimeout(() => {
        if (liveRegion) {
          liveRegion.textContent = mobileAnnouncement;
        }
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        // Don't remove the region, just clear its content when component unmounts
        if (liveRegion) {
          liveRegion.textContent = '';
        }
      };
    }
  }, [isActive, currentStepData]);
  
  // Handle animation reduced motion preferences
  useEffect(() => {
    if (isActive && prefersReducedMotion) {
      // Find and disable animations when reduced motion is preferred
      const tourElements = document.querySelectorAll('[class*="animate-"]');
      
      // Store original animation classes to restore them later
      const originalAnimations = new Map<Element, string>();
      
      tourElements.forEach(element => {
        // Find animation classes
        const classes = element.className.split(' ');
        const animationClasses = classes.filter(cls => cls.startsWith('animate-'));
        
        if (animationClasses.length > 0) {
          // Store original classes
          originalAnimations.set(element, animationClasses.join(' '));
          
          // Remove animation classes
          animationClasses.forEach(cls => {
            element.classList.remove(cls);
          });
        }
      });
      
      return () => {
        // Restore original animation classes
        originalAnimations.forEach((classes, element) => {
          classes.split(' ').forEach(cls => {
            element.classList.add(cls);
          });
        });
      };
    }
  }, [isActive, prefersReducedMotion]);
  
  // Don't render anything visible
  return null;
};
