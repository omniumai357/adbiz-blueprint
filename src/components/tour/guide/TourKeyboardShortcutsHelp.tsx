
import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTourFocusTrap } from "@/hooks/tour/useTourFocusTrap";

interface TourKeyboardShortcutsHelpProps {
  onClose: () => void;
}

interface ShortcutInfo {
  key: string;
  description: string;
  keyDisplay: string | string[];
}

export const TourKeyboardShortcutsHelp: React.FC<TourKeyboardShortcutsHelpProps> = ({
  onClose
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Use our focus trap to keep focus inside the dialog
  useTourFocusTrap(true, dialogRef, true);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  // Auto-focus on dialog when it opens
  useEffect(() => {
    if (dialogRef.current) {
      const focusTarget = dialogRef.current.querySelector('[data-autofocus]') as HTMLElement;
      if (focusTarget) {
        setTimeout(() => focusTarget.focus(), 50);
      }
    }
  }, []);
  
  const shortcuts: ShortcutInfo[] = [
    { key: "next", description: "Go to next step", keyDisplay: ["→", "N", "Enter"] },
    { key: "prev", description: "Go to previous step", keyDisplay: ["←", "P"] },
    { key: "home", description: "Go to first step", keyDisplay: ["Home"] },
    { key: "end", description: "Go to last step", keyDisplay: ["End"] },
    { key: "page_up", description: "Jump 3 steps backward", keyDisplay: ["Page Up"] },
    { key: "page_down", description: "Jump 3 steps forward", keyDisplay: ["Page Down"] },
    { key: "help", description: "Show keyboard shortcuts", keyDisplay: ["Shift", "?"] },
    { key: "escape", description: "Close tour", keyDisplay: ["Esc"] },
    { key: "tab", description: "Navigate between elements", keyDisplay: ["Tab"] },
    { key: "access_next", description: "Accessibility shortcut for next", keyDisplay: ["Alt", "Shift", "N"] },
    { key: "access_prev", description: "Accessibility shortcut for previous", keyDisplay: ["Alt", "Shift", "P"] },
    { key: "access_skip", description: "Accessibility shortcut for skip", keyDisplay: ["Alt", "Shift", "S"] },
    { key: "access_help", description: "Accessibility shortcut for help", keyDisplay: ["Alt", "Shift", "H"] },
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-md"
        ref={dialogRef}
        aria-labelledby="keyboard-shortcuts-title"
        aria-describedby="keyboard-shortcuts-description"
      >
        <DialogHeader>
          <DialogTitle id="keyboard-shortcuts-title" className="text-xl">Keyboard Shortcuts</DialogTitle>
          <DialogDescription id="keyboard-shortcuts-description">
            Use these keyboard shortcuts to navigate the tour
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-80 overflow-y-auto pr-2">
          <div className="grid gap-3">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="grid grid-cols-[2fr_3fr] items-center gap-4">
                <div className="flex items-center gap-1 justify-end">
                  {Array.isArray(shortcut.keyDisplay) ? (
                    shortcut.keyDisplay.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd className="inline-flex h-7 items-center justify-center rounded border border-border bg-muted px-2 text-sm font-medium">
                          {key}
                        </kbd>
                        {i < shortcut.keyDisplay.length - 1 && 
                         !["Shift", "Alt", "Ctrl"].includes(key) && 
                         !["Shift", "Alt", "Ctrl"].includes(shortcut.keyDisplay[i+1]) && (
                          <span className="mx-1 text-muted-foreground">or</span>
                        )}
                        {["Shift", "Alt", "Ctrl"].includes(key) && (
                          <span className="mx-1 text-muted-foreground">+</span>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <kbd className="inline-flex h-7 items-center justify-center rounded border border-border bg-muted px-2 text-sm font-medium">
                      {shortcut.keyDisplay}
                    </kbd>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            onClick={onClose}
            data-autofocus="true"
            className="h-9"
          >
            Close
          </Button>
        </div>
        
        <DialogClose asChild>
          <Button
            className="absolute top-3 right-3 h-7 w-7 p-0"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
