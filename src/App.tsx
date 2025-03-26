
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorProvider } from './contexts/error-context';
import { TourGuide } from './components/tour/TourGuide';
import { ErrorBoundary } from './components/error/ErrorBoundary';
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

const App = () => {
  return (
    <ErrorProvider>
      <AuthContextProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<PageWithTour><Home /></PageWithTour>} />
            <Route path="/checkout" element={<Checkout />} />
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
        </ErrorBoundary>
      </AuthContextProvider>
    </ErrorProvider>
  );
};

export default App;
