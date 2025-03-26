
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface LanguageSwitchAnimationProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const LanguageSwitchAnimation: React.FC<LanguageSwitchAnimationProps> = ({
  children,
  className,
  duration = 300
}) => {
  const { isChangingLanguage, currentLanguage } = useLanguage();
  const [key, setKey] = useState(currentLanguage);
  const [isAnimating, setIsAnimating] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (currentLanguage !== key) {
      setIsAnimating(true);
      
      // Start exit animation
      const timeout = setTimeout(() => {
        setKey(currentLanguage);
        setContent(children);
        
        // Once content is updated, allow entry animation to complete
        setTimeout(() => {
          setIsAnimating(false);
        }, duration / 2);
      }, duration / 2);
      
      return () => clearTimeout(timeout);
    }
  }, [children, currentLanguage, duration, key]);

  return (
    <div
      key={key}
      className={cn(
        "transition-all",
        isAnimating ? "opacity-0" : "opacity-100",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {content}
    </div>
  );
};

export default LanguageSwitchAnimation;
