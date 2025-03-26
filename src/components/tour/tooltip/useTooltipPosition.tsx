
import { useState, useEffect } from "react";

type Position = "top" | "right" | "bottom" | "left";

interface PositionOutput {
  tooltipPosition: { top: number; left: number };
  arrowPosition: { top: string | number; left: string | number };
  tooltipStyles: React.CSSProperties;
  arrowStyles: React.CSSProperties;
  arrowClassNames: string;
  visible: boolean;
}

export const useTooltipPosition = (
  targetElement: HTMLElement,
  position: Position,
  transitionDuration: number = 300
): PositionOutput => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<{ top: string | number; left: string | number }>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay showing the tooltip to allow for animation
    const timer = setTimeout(() => setVisible(true), 50);
    
    const calculatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Add a small buffer for spacing between tooltip and target
      const buffer = 16;

      // Base position calculations
      const positions = {
        top: {
          top: rect.top + scrollY - buffer,
          left: rect.left + scrollX + rect.width / 2,
          arrowTop: '100%',
          arrowLeft: '50%',
          transform: 'translate(-50%, -100%)',
        },
        right: {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX + rect.width + buffer,
          arrowTop: '50%',
          arrowLeft: '0',
          transform: 'translate(0, -50%)',
        },
        bottom: {
          top: rect.top + scrollY + rect.height + buffer,
          left: rect.left + scrollX + rect.width / 2,
          arrowTop: '0',
          arrowLeft: '50%',
          transform: 'translate(-50%, 0)',
        },
        left: {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX - buffer,
          arrowTop: '50%',
          arrowLeft: '100%',
          transform: 'translate(-100%, -50%)',
        },
      };

      // Position based on specified direction
      const pos = positions[position];
      
      setTooltipPosition({
        top: pos.top,
        left: pos.left,
      });
      
      setArrowPosition({
        top: pos.arrowTop,
        left: pos.arrowLeft,
      });
    };

    calculatePosition();
    
    // Recalculate on window resize and scroll
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
      clearTimeout(timer);
    };
  }, [targetElement, position]);

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    top: `${tooltipPosition.top}px`,
    left: `${tooltipPosition.left}px`,
    transform: (() => {
      switch (position) {
        case 'top': return 'translate(-50%, -100%)';
        case 'right': return 'translate(0, -50%)';
        case 'bottom': return 'translate(-50%, 0)';
        case 'left': return 'translate(-100%, -50%)';
        default: return 'translate(-50%, 0)';
      }
    })(),
    opacity: visible ? 1 : 0,
    transition: `opacity ${transitionDuration}ms ease-in-out, transform ${transitionDuration}ms ease-in-out`,
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    top: arrowPosition.top,
    left: arrowPosition.left,
    transform: 'translate(-50%, -50%) rotate(45deg)',
  };

  const arrowClassNames = (() => {
    switch (position) {
      case 'top': return 'border-b border-r';
      case 'right': return 'border-l border-b';
      case 'bottom': return 'border-t border-l';
      case 'left': return 'border-t border-r';
      default: return 'border-t border-l';
    }
  })();

  return {
    tooltipPosition,
    arrowPosition,
    tooltipStyles,
    arrowStyles,
    arrowClassNames,
    visible
  };
};
