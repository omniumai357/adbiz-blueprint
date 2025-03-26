
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTour } from "@/contexts/tour";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { HelpCircle, X } from "lucide-react";

interface WelcomeTourModalProps {
  forceShow?: boolean;
}

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({
  forceShow = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour, availablePaths } = useTour();
  const location = useLocation();

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcomeModal = localStorage.getItem("hasSeenWelcomeModal");
    
    if (forceShow || (!hasSeenWelcomeModal && location.pathname !== "/auth" && location.pathname !== "/login" && location.pathname !== "/signup")) {
      // Delay showing the modal slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [forceShow, location.pathname]);

  const handleStartTour = () => {
    // Find the appropriate tour for the current page
    let tourId = null;
    
    if (location.pathname === "/") {
      tourId = availablePaths.find(p => p.id.includes("home"))?.id;
    } else if (location.pathname.includes("checkout")) {
      tourId = availablePaths.find(p => p.id.includes("checkout"))?.id;
    } else if (location.pathname.includes("services")) {
      tourId = availablePaths.find(p => p.id.includes("services"))?.id;
    } else if (location.pathname.includes("contact")) {
      tourId = availablePaths.find(p => p.id.includes("contact"))?.id;
    }
    
    // If no specific tour found, use the first available one
    if (!tourId && availablePaths.length > 0) {
      tourId = availablePaths[0].id;
    }
    
    // Mark that the user has seen the welcome modal
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setIsOpen(false);
    
    // Start the tour if a tour is available
    if (tourId) {
      startTour(tourId);
    }
  };

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setIsOpen(false);
  };

  // Get title and content based on current page
  const getPageSpecificContent = () => {
    if (location.pathname.includes("checkout")) {
      return {
        title: "Welcome to Checkout",
        description: "Would you like a guided tour to help you complete your purchase? Our interactive guide will walk you through each section of the checkout process."
      };
    } else if (location.pathname === "/") {
      return {
        title: "Welcome to AdBiz.pro",
        description: "Would you like a quick tour to see what we offer? Our guided experience will help you get familiar with our services."
      };
    } else if (location.pathname.includes("services")) {
      return {
        title: "Explore Our Services",
        description: "Would you like a guided tour of our service offerings? We'll show you how to find the perfect package for your business."
      };
    }
    
    // Default content
    return {
      title: "Welcome to Our Site",
      description: "Would you like a guided tour to help you navigate? Our interactive guide will show you key features and how to get the most out of your experience."
    };
  };

  const { title, description } = getPageSpecificContent();

  // Only render if there are available tours
  if (availablePaths.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={handleClose} className="sm:flex-1">
            No thanks
          </Button>
          <Button onClick={handleStartTour} className="sm:flex-1">
            Start Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
