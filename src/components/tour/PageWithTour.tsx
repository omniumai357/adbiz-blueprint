
import React from "react";
import { useLocation } from "react-router-dom";
import { TourProvider } from "@/contexts/tour-context";
import { TourGuide } from "@/components/tour/TourGuide";

interface PageWithTourProps {
  children: React.ReactNode;
}

export const PageWithTour: React.FC<PageWithTourProps> = ({ children }) => {
  const location = useLocation();

  return (
    <TourProvider currentPathname={location.pathname}>
      {children}
      <TourGuide />
    </TourProvider>
  );
};
