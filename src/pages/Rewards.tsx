
import React from "react";
import Header from "@/components/Header";
import MilestonesDashboard from "@/components/rewards/MilestonesDashboard";
import { useAuth } from "@/contexts/auth-context";

/**
 * Rewards Page Component
 * 
 * Displays the user's milestones and rewards dashboard.
 * 
 * Features:
 * - Accessed via the /rewards route
 * - Gets the current user from auth context
 * - Passes user ID to the milestones dashboard
 * - Displays reward progress and available rewards
 * - Handles both authenticated and unauthenticated states
 * 
 * @remarks
 * The Rewards page integrates with the MilestonesDashboard component to display
 * user progress towards various milestones. User authentication is handled through
 * the auth context.
 */
const Rewards = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Rewards & Milestones</h1>
          
          {/* Pass the user ID to the milestones dashboard */}
          <MilestonesDashboard userId={user?.id} />
        </div>
      </main>
    </div>
  );
};

export default Rewards;
