
import React from 'react';
import { ThemeDemo } from '@/components/tour/ThemeDemo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ThemeDemoPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Tour Theme Configuration</h1>
          <p className="text-muted-foreground mb-8">
            This page demonstrates the tour theme system and allows you to customize the appearance
            of tour components to match your application's design.
          </p>
          
          <ThemeDemo />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThemeDemoPage;
