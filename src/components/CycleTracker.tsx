
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, addDays } from "date-fns";
import { getCurrentPhase, getCycleWeek, getPhaseDescription, getNextPhaseDate } from "@/lib/cycle-utils";
import { CyclePhase } from "@/lib/types";

const CycleTracker = () => {
  const today = new Date();
  const currentPhase = getCurrentPhase(today);
  const currentWeek = getCycleWeek(today);
  const phaseDescription = getPhaseDescription(currentPhase);
  const nextPhaseDate = getNextPhaseDate(today);
  const daysUntilNextPhase = Math.ceil((nextPhaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const getPhaseColor = (phase: CyclePhase): string => {
    switch (phase) {
      case "regular": return "bg-supplement";
      case "reduced": return "bg-amber-500";
      case "break": return "bg-red-500";
      case "restart": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Supplement Cycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Current Phase:</span>
            <span className="text-sm bg-supplement-light px-2 py-1 rounded-full text-supplement-dark">
              {phaseDescription}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Week:</span>
            <span>{currentWeek} of 10</span>
          </div>
          
          <div className="mt-2">
            <Progress 
              value={currentWeek * 10} 
              className={`h-2 ${getPhaseColor(currentPhase)}`}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Week 1</span>
            <span>Week 10</span>
          </div>
          
          <div className="mt-4 bg-muted rounded-md p-3">
            <div className="text-sm">
              Next phase starts in <span className="font-bold">{daysUntilNextPhase} days</span>
              <span className="block text-xs mt-1 text-muted-foreground">
                {format(nextPhaseDate, "EEEE, MMMM d")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CycleTracker;