
import React from "react";
import Layout from "@/components/Layout";
import { format } from "date-fns";
import CycleTracker from "@/components/CycleTracker";
import SupplementReminder from "@/components/SupplementReminder";
import { getCurrentPhase } from "@/lib/cycle-utils";

const Index = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d");
  const currentPhase = getCurrentPhase(today);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        
        <CycleTracker />
        
        <SupplementReminder timeOfDay="morning" />
        
        <SupplementReminder timeOfDay="afternoon" />
        
        {currentPhase === "break" && (
          <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-lg p-4 text-sm">
            <strong>Break Period:</strong> You're currently in your supplement break period.
            This helps your body reset and prevents developing tolerance to your supplements.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;