
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './contexts/auth-context';
import { TourProvider } from './contexts/tour-context';
import { TourGuide } from './components/tour/TourGuide';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Receipts from './pages/Receipts';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Rewards from './pages/Rewards';
import { Toaster } from "@/components/ui/toaster";

// Create the router with all page routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    element: <Services />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/rewards",
    element: <Rewards />
  },
]);

function App() {
  return (
    <AuthContextProvider>
      <TourProvider>
        <RouterProvider router={router} />
        <TourGuide />
        <Toaster />
      </TourProvider>
    </AuthContextProvider>
  );
}

export default App;
