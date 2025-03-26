
import React, { createContext, useContext } from "react";
import { TourContextType, TourStep } from './types';
import { defaultContext } from './defaults';

const TourContext = createContext<TourContextType>(defaultContext);

export const useTour = () => useContext(TourContext);

export { TourContext };
