
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Modal context type definition
 */
type ModalContextType = {
  /**
   * Show a modal with the specified content and optional title
   */
  showModal: (content: ReactNode, title?: string) => void;
  
  /**
   * Hide the currently displayed modal
   */
  hideModal: () => void;
};

/**
 * Context for managing modal state and operations
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Hook for accessing the modal context
 * 
 * @returns The modal context with showModal and hideModal functions
 * @throws Error if used outside a ModalProvider
 * 
 * @example
 * const { showModal, hideModal } = useModal();
 * 
 * // Show a modal
 * showModal(<p>Modal content here</p>, "Optional Title");
 * 
 * // Hide the modal
 * hideModal();
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Provider component for modal functionality
 * 
 * Wraps the application to provide modal capabilities throughout
 * the component tree. Uses the shadcn Dialog component for the UI.
 * 
 * @param children - The child components
 * 
 * @example
 * // In your app root
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

  /**
   * Shows a modal with the specified content and optional title
   * 
   * @param content - The React node to display in the modal
   * @param title - Optional title to display at the top of the modal
   */
  const showModal = (content: ReactNode, title?: string) => {
    setModalContent(content);
    setModalTitle(title);
    setIsOpen(true);
  };

  /**
   * Hides the currently displayed modal
   * Clears the content after the animation completes
   */
  const hideModal = () => {
    setIsOpen(false);
    // Clear content after animation completes
    setTimeout(() => {
      setModalContent(null);
      setModalTitle(undefined);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          {modalTitle && (
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
            </DialogHeader>
          )}
          {modalContent}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}
