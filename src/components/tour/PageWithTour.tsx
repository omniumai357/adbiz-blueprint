
import React, { ReactNode } from 'react';
import { TourGuide } from './TourGuide';

interface PageWithTourProps {
  children: ReactNode;
}

export const PageWithTour = ({ children }: PageWithTourProps) => {
  return (
    <>
      {children}
      <TourGuide />
    </>
  );
};
