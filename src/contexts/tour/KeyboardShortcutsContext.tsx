
import React, { createContext, useContext, useState } from "react";

interface KeyboardShortcutsContextType {
  showKeyboardHelp: boolean;
  setShowKeyboardHelp: (show: boolean) => void;
  closeKeyboardShortcutsHelp: () => void;
  showKeyboardShortcutsHelp: () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({
  showKeyboardHelp: false,
  setShowKeyboardHelp: () => {},
  closeKeyboardShortcutsHelp: () => {},
  showKeyboardShortcutsHelp: () => {},
});

export const useKeyboardShortcuts = () => useContext(KeyboardShortcutsContext);

export const KeyboardShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const showKeyboardShortcutsHelp = () => {
    setShowKeyboardHelp(true);
  };

  const closeKeyboardShortcutsHelp = () => {
    setShowKeyboardHelp(false);
  };

  return (
    <KeyboardShortcutsContext.Provider 
      value={{ 
        showKeyboardHelp, 
        setShowKeyboardHelp, 
        closeKeyboardShortcutsHelp,
        showKeyboardShortcutsHelp 
      }}
    >
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};
