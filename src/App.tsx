
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
import { Toaster } from "@/components/ui/toaster";
import { PageWithTour } from './components/tour/PageWithTour';

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
]);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthContextProvider>
  );
}

export default App;
