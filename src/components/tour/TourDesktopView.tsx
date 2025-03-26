
import React, { forwardRef } from "react";
import { TourTooltip } from "./TourTooltip";

// Re-export TourTooltip as TourDesktopView for naming consistency with proper ref forwarding
export const TourDesktopView = forwardRef<HTMLDivElement, React.ComponentProps<typeof TourTooltip>>((props, ref) => {
  return <TourTooltip {...props} ref={ref} />;
});

TourDesktopView.displayName = "TourDesktopView";
