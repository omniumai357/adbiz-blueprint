
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './contexts/auth-context';
import { TourGuide } from './components/tour/TourGuide';
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
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

// Create the router with all page routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <PageWithTour><Home /></PageWithTour>,
  },
  {
    path: "/checkout",
    element: <Checkout />
  },
  {
    path: "/receipts",
    element: <Receipts />
  },
  {
    path: "/services",
    element: <PageWithTour><Services /></PageWithTour>,
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/contact",
    element: <PageWithTour><Contact /></PageWithTour>,
  },
  {
    path: "/rewards",
    element: <Rewards />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/login",
    element: <Auth />
  },
  {
    path: "/signup",
    element: <Auth />
  },
]);

const App = () => {
  return (
    <ReactQueryProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <Toaster />
        <Sonner />
      </AuthContextProvider>
    </ReactQueryProvider>
  );
};

export default App;
