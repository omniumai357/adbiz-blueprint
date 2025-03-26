
import React from "react";
import { TourPath } from "../path/TourPath";

interface TourPathVisualizationProps {
  isActive: boolean;
  sourceElement: HTMLElement | null;
  targetElement: HTMLElement | null;
  pathOptions?: any;
}

export const TourPathVisualization: React.FC<TourPathVisualizationProps> = ({
  isActive,
  sourceElement,
  targetElement,
  pathOptions
}) => {
  if (!isActive || !sourceElement || !targetElement) {
    return null;
  }

  return (
    <TourPath
      sourceElement={sourceElement}
      targetElement={targetElement}
      isActive={true}
      options={pathOptions}
      ariaHidden={true}
    />
  );
};
