
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/language-context';
import './App.css';
import './i18n';

import { ErrorProvider } from './contexts/error-context';
import { TourGuide } from './components/tour/TourGuide';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { TourHeaderButton } from './components/tour/TourHeaderButton';
import { WelcomeTourModal } from './components/tour/WelcomeTourModal';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Receipts from './pages/Receipts';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Rewards from './pages/Rewards';
import Auth from './pages/Auth';
import { Toaster } from "@/components/ui/toaster";
import { PageWithTour } from './components/tour/PageWithTour';
import { Toaster as Sonner } from "@/components/ui/sonner";
import BusinessQuestionnairePage from './pages/BusinessQuestionnaire';
import { AuthContextProvider } from '@/features/auth';
import { initializeServices } from './services/registry/init';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { useLanguageA11y } from './hooks/useLanguageA11y';

// Language observer component for accessibility
const LanguageObserver = () => {
  useLanguageA11y();
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    initializeServices();
  }, []);

  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <LanguageProvider>
          <LanguageObserver />
          <ErrorProvider>
            <AuthContextProvider>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<PageWithTour><Home /></PageWithTour>} />
                  <Route path="/checkout" element={<PageWithTour><Checkout /></PageWithTour>} />
                  <Route path="/receipts" element={<Receipts />} />
                  <Route path="/services" element={<PageWithTour><Services /></PageWithTour>} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<PageWithTour><Contact /></PageWithTour>} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                  <Route path="/business-questionnaire" element={<BusinessQuestionnairePage />} />
                </Routes>
                <Toaster />
                <Sonner />
                <TourGuide />
                <TourHeaderButton />
                <WelcomeTourModal />
              </ErrorBoundary>
            </AuthContextProvider>
          </ErrorProvider>
        </LanguageProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  );
};

export default App;
