
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useSupplements } from "@/context/SupplementContext";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentPhase, getDosageModifier } from "@/lib/cycle-utils";
import { CyclePhase } from "@/lib/types";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { getSchedulesByDate, markAsTaken } = useSupplements();
  
  const schedules = getSchedulesByDate(selectedDate);
  const morningSchedules = schedules.filter(s => s.supplement.morning);
  const afternoonSchedules = schedules.filter(s => s.supplement.afternoon);
  
  const currentPhase = getCurrentPhase(selectedDate);
  const dosageModifier = getDosageModifier(currentPhase);
  
  // Function to get highlight color for calendar days based on cycle phase
  const getDayHighlight = (date: Date) => {
    const phase = getCurrentPhase(date);
    switch (phase) {
      case "regular": return "bg-supplement-light/20 text-supplement-dark rounded-md";
      case "reduced": return "bg-amber-100 text-amber-800 rounded-md";
      case "break": return "bg-red-100 text-red-800 rounded-md";
      case "restart": return "bg-green-100 text-green-800 rounded-md";
      default: return "";
    }
  };
  
  // Show the phase on the calendar
  const getPhaseLabel = (phase: CyclePhase) => {
    switch (phase) {
      case "regular": return "Regular";
      case "reduced": return "Reduced";
      case "break": return "Break";
      case "restart": return "Restart";
      default: return "";
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        
        <Card>
          <CardContent className="pt-6">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                highlight: [selectedDate]
              }}
              modifiersStyles={{
                highlight: {
                  backgroundColor: "rgb(var(--primary) / .1)",
                  color: "hsl(var(--primary))",
                  fontWeight: "bold"
                }
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const dayProps = props as React.HTMLAttributes<HTMLDivElement>;
                  const highlight = getDayHighlight(date);
                  return (
                    <div 
                      className={cn(
                        "relative", 
                        highlight
                      )} 
                      {...dayProps}
                    >
                      {dayProps.children}
                      {date.getDate() === 1 && (
                        <span className="absolute -top-5 left-0 text-[10px] font-semibold text-muted-foreground">
                          {format(date, "MMM")}
                        </span>
                      )}
                      <span className="absolute -bottom-5 left-0 w-full text-[8px] text-center font-medium text-muted-foreground">
                        {getPhaseLabel(getCurrentPhase(date))}
                      </span>
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
        
        <div className="bg-muted p-3 rounded-lg">
          <div className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
          <div className="text-sm text-muted-foreground">
            Phase: {getPhaseLabel(currentPhase)}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Morning</h2>
          {morningSchedules.length > 0 ? (
            <div className="space-y-2">
              {morningSchedules.map((schedule) => (
                <div 
                  key={`morning-${schedule.supplement.id}`}
                  className="flex justify-between items-center bg-white p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{schedule.supplement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentPhase !== "regular" ? (
                        <span className="flex items-center gap-1">
                          <span className={dosageModifier === 0 ? "line-through text-gray-400" : ""}>
                            {dosageModifier > 0 
                              ? `${schedule.supplement.dosage} × ${dosageModifier * 100}%` 
                              : "Skip"}
                          </span>
                        </span>
                      ) : (
                        schedule.supplement.dosage
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
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm bg-white p-4 rounded-lg border text-center">
              No morning supplements for this day
            </div>
          )}
          
          <h2 className="text-lg font-medium pt-2">Afternoon</h2>
          {afternoonSchedules.length > 0 ? (
            <div className="space-y-2">
              {afternoonSchedules.map((schedule) => (
                <div 
                  key={`afternoon-${schedule.supplement.id}`}
                  className="flex justify-between items-center bg-white p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{schedule.supplement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentPhase !== "regular" ? (
                        <span className="flex items-center gap-1">
                          <span className={dosageModifier === 0 ? "line-through text-gray-400" : ""}>
                            {dosageModifier > 0 
                              ? `${schedule.supplement.dosage} × ${dosageModifier * 100}%` 
                              : "Skip"}
                          </span>
                        </span>
                      ) : (
                        schedule.supplement.dosage
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
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm bg-white p-4 rounded-lg border text-center">
              No afternoon supplements for this day
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
