
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Welcome to Your App</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Explore Services</h2>
              <p className="text-gray-600 mb-4">
                Check out our range of services and packages tailored to your needs.
              </p>
              <Link 
                to="/services" 
                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                View Services
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Rewards Program</h2>
              <p className="text-gray-600 mb-4">
                Earn points and unlock exclusive rewards with our milestone-based program.
              </p>
              <Link 
                to="/rewards" 
                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                View Rewards
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
