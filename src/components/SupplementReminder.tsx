
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { SupplementSchedule } from "@/lib/types"; 
import { useSupplements } from "@/context/SupplementContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentPhase, getDosageModifier } from "@/lib/cycle-utils";

interface SupplementReminderProps {
  timeOfDay: "morning" | "afternoon";
}

const SupplementReminder = ({ timeOfDay }: SupplementReminderProps) => {
  const { getTodaySchedules, markAsTaken } = useSupplements();
  const today = new Date();
  const currentPhase = getCurrentPhase(today);
  const dosageModifier = getDosageModifier(currentPhase);
  
  // Filter schedules for the current time of day
  const schedules = getTodaySchedules().filter(
    schedule => schedule.supplement[timeOfDay]
  );
  
  const timeLabel = timeOfDay === "morning" ? "Morning" : "Afternoon";
  
  // Check if all supplements for this time have been taken
  const allTaken = schedules.length > 0 && schedules.every(s => s.taken);
  const someTaken = schedules.some(s => s.taken);
  
  // Handle marking all as taken or not taken
  const handleMarkAll = (taken: boolean) => {
    schedules.forEach(schedule => {
      const scheduleId = `${schedule.supplement.id}-${format(schedule.date, "yyyy-MM-dd")}`;
      markAsTaken(scheduleId, taken);
    });
  };

  // Get the current time of day status
  const getTimeStatus = () => {
    if (schedules.length === 0) return "No supplements scheduled";
    if (allTaken) return "All taken";
    if (someTaken) return "Partially taken";
    return "Not taken";
  };
  
  // Color based on status
  const getStatusColor = () => {
    if (schedules.length === 0) return "bg-gray-200 text-gray-500";
    if (allTaken) return "bg-green-100 text-green-800";
    if (someTaken) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{timeLabel} Supplements</CardTitle>
          <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor())}>
            {getTimeStatus()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => {
              // Calculate dosage based on current phase
              const actualDosage = schedule.supplement.dosage;
              const modifiedDosage = dosageModifier > 0 
                ? `${actualDosage} × ${dosageModifier * 100}%` 
                : "Skip";
                
              return (
                <div 
                  key={`${schedule.supplement.id}-${timeOfDay}`}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{schedule.supplement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentPhase !== "regular" ? (
                        <span className="flex items-center gap-1">
                          <span className={dosageModifier === 0 ? "line-through text-gray-400" : ""}>
                            {modifiedDosage}
                          </span>
                          {dosageModifier === 0 && (
                            <span className="text-red-500 text-xs">(Break period)</span>
                          )}
                        </span>
                      ) : (
                        actualDosage
                      )}
                    </div>
                  </div>
                  <Button
                    variant={schedule.taken ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      schedule.taken && "bg-green-500 hover:bg-green-600"
                    )}
                    onClick={() => {
                      const scheduleId = `${schedule.supplement.id}-${format(schedule.date, "yyyy-MM-dd")}`;
                      markAsTaken(scheduleId, !schedule.taken);
                    }}
                    disabled={currentPhase === "break"}
                  >
                    <Check className={cn("h-4 w-4", schedule.taken ? "opacity-100" : "opacity-0")} />
                  </Button>
                </div>
              );
            })}
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleMarkAll(true)}
                disabled={allTaken || currentPhase === "break"}
              >
                Mark all taken
              </Button>
              {someTaken && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleMarkAll(false)}
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No {timeOfDay} supplements scheduled
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplementReminder;
