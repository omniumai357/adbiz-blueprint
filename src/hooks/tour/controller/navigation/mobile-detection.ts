
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language-context';

/**
 * Hook to detect if the current device is mobile and the interface direction
 * @returns Object with mobile detection and RTL information
 */
export const useMobileKeyboardDetection = () => {
  const isMobile = useIsMobile();
  const { direction, isRTL } = useLanguage();
  
  return {
    isMobile,
    isRTL,
    direction
  };
};
