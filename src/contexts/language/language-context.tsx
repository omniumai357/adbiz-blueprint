
import React, { createContext, useContext } from 'react';
import { LanguageContextType } from './types';
import { useLanguageProvider } from './use-language-provider';

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue = useLanguageProvider();
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
