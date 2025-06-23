
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { useSupplements } from "@/context/SupplementContext";
import { BarChart, Clipboard, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCycleStartDate, getCycleWeek, getCurrentPhase } from "@/lib/cycle-utils";
import { CyclePhase } from "@/lib/types";

const Progress = () => {
  const { schedules } = useSupplements();
  const [activeTab, setActiveTab] = useState("week");
  const today = new Date();
  
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });
  
  // Calculate adherence metrics
  const totalMorningDoses = schedules.filter(s => 
    s.supplement.morning && s.date >= startOfCurrentWeek && s.date <= endOfCurrentWeek
  ).length;
  
  const takenMorningDoses = schedules.filter(s => 
    s.supplement.morning && s.taken && s.date >= startOfCurrentWeek && s.date <= endOfCurrentWeek
  ).length;
  
  const totalAfternoonDoses = schedules.filter(s => 
    s.supplement.afternoon && s.date >= startOfCurrentWeek && s.date <= endOfCurrentWeek
  ).length;
  
  const takenAfternoonDoses = schedules.filter(s => 
    s.supplement.afternoon && s.taken && s.date >= startOfCurrentWeek && s.date <= endOfCurrentWeek
  ).length;
  
  const morningAdherence = totalMorningDoses > 0 
    ? Math.round((takenMorningDoses / totalMorningDoses) * 100) 
    : 0;
    
  const afternoonAdherence = totalAfternoonDoses > 0 
    ? Math.round((takenAfternoonDoses / totalAfternoonDoses) * 100) 
    : 0;
    
  const overallAdherence = (totalMorningDoses + totalAfternoonDoses) > 0
    ? Math.round(((takenMorningDoses + takenAfternoonDoses) / (totalMorningDoses + totalAfternoonDoses)) * 100)
    : 0;
  
  // Get cycle information
  const cycleStartDate = getCycleStartDate();
  const currentWeek = getCycleWeek();
  const currentPhase = getCurrentPhase();
  
  // Helper to get background color based on phase
  const getPhaseColor = (phase: CyclePhase): string => {
    switch (phase) {
      case "regular": return "bg-supplement-light";
      case "reduced": return "bg-amber-100";
      case "break": return "bg-red-100";
      case "restart": return "bg-green-100";
      default: return "bg-gray-100";
    }
  };
  
  // Helper to get text color based on phase
  const getPhaseTextColor = (phase: CyclePhase): string => {
    switch (phase) {
      case "regular": return "text-supplement-dark";
      case "reduced": return "text-amber-800";
      case "break": return "text-red-800";
      case "restart": return "text-green-800";
      default: return "text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Progress</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="cycle">Cycle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weekly Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-supplement/10 p-4">
                      <Award className="h-6 w-6 text-supplement" />
                    </div>
                    <h3 className="mt-2 font-semibold text-xl">{overallAdherence}%</h3>
                    <p className="text-sm text-muted-foreground">Overall Adherence</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="font-medium text-lg">{morningAdherence}%</div>
                      <p className="text-sm text-muted-foreground">Morning</p>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-lg">{afternoonAdherence}%</div>
                      <p className="text-sm text-muted-foreground">Afternoon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {daysInWeek.map((day) => {
                    const daySchedules = schedules.filter(s => 
                      isSameDay(new Date(s.date), day)
                    );
                    const morningSchedules = daySchedules.filter(s => s.supplement.morning);
                    const afternoonSchedules = daySchedules.filter(s => s.supplement.afternoon);
                    
                    const morningTaken = morningSchedules.filter(s => s.taken).length;
                    const afternoonTaken = afternoonSchedules.filter(s => s.taken).length;
                    
                    const morningTotal = morningSchedules.length;
                    const afternoonTotal = afternoonSchedules.length;
                    
                    const morningPercentage = morningTotal > 0 ? (morningTaken / morningTotal) * 100 : 0;
                    const afternoonPercentage = afternoonTotal > 0 ? (afternoonTaken / afternoonTotal) * 100 : 0;
                    
                    const isPast = day < today;
                    const isToday = isSameDay(day, today);
                    
                    return (
                      <div key={format(day, "yyyy-MM-dd")} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <div className="font-medium">
                              {isToday ? "Today" : format(day, "EEEE")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(day, "MMM d")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {morningTaken + afternoonTaken}/{morningTotal + afternoonTotal}
                            </div>
                            <div className="text-xs text-muted-foreground">supplements taken</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Morning</span>
                              <span>{morningTaken}/{morningTotal}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-supplement"
                                style={{ width: `${morningPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Afternoon</span>
                              <span>{afternoonTaken}/{afternoonTotal}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-supplement"
                                style={{ width: `${afternoonPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cycle" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cycle Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">Cycle started on</div>
                    <div className="font-medium">{format(cycleStartDate, "MMMM d, yyyy")}</div>
                  </div>
                  
                  <div className="space-y-4">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((week) => {
                      const isCurrentWeek = week === currentWeek;
                      const isPastWeek = week < currentWeek;
                      
                      // Determine phase for each week
                      let phase: CyclePhase = "regular";
                      if (week === 7) phase = "reduced";
                      else if (week === 8 || week === 9) phase = "break";
                      else if (week === 10) phase = "restart";
                      else phase = "regular";
                      
                      return (
                        <div 
                          key={`week-${week}`}
                          className={`border p-3 rounded-md ${
                            isCurrentWeek 
                              ? "border-supplement" 
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Week {week}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${getPhaseColor(phase)} ${getPhaseTextColor(phase)}`}>
                                  {phase}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {phase === "regular" && "Regular dosage"}
                                {phase === "reduced" && "Reduced dosage (50%)"}
                                {phase === "break" && "No supplements"}
                                {phase === "restart" && "Restart (25% dosage)"}
                              </div>
                            </div>
                            {isCurrentWeek && (
                              <div className="bg-supplement text-white text-xs px-2 py-1 rounded">
                                Current
                              </div>
                            )}
                            {isPastWeek && (
                              <div className="text-green-500">
                                <Check className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Progress;