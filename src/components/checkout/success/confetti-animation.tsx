
import React, { useEffect, useState } from "react";

/**
 * A reusable confetti animation component for celebration moments
 */
const ConfettiAnimation: React.FC = () => {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    // Delay activation for a smooth entrance
    const timer = setTimeout(() => setActive(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex justify-center">
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              opacity: Math.random(),
              animation: `fall ${Math.random() * 3 + 2}s linear forwards, sway ${Math.random() * 2 + 3}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfettiAnimation;
