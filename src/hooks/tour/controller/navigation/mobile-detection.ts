
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Hook to detect if the current device is mobile
 * @returns boolean indicating if the device is mobile
 */
export const useMobileKeyboardDetection = () => {
  const isMobile = useIsMobile();
  return isMobile;
};
