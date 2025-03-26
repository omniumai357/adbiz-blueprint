
import React, { useEffect } from "react";

export const TourFocusStyles: React.FC = () => {
  useEffect(() => {
    const styleId = 'tour-focus-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tour-active-focus-mode :focus {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.25) !important;
          border-radius: 2px !important;
          transition: outline-color 0.2s ease-in-out !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .tour-active-focus-mode :focus:not(:focus-visible) {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .tour-active-focus-mode :focus-visible {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.25) !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .tour-active-focus-mode [data-tour-action]:focus-visible::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 4px;
          background: rgba(14, 165, 233, 0.1);
          z-index: -1;
          animation: pulse-focus 2s infinite;
        }
        
        @keyframes pulse-focus {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .tour-tooltip:focus-within {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        
        @media (forced-colors: active) {
          .tour-active-focus-mode :focus,
          .tour-active-focus-mode :focus-visible {
            outline: 3px solid CanvasText !important;
            outline-offset: 2px !important;
          }
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return null;
};
