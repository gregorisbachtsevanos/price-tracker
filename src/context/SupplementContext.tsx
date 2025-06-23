
import React, { createContext, useContext, useState, useEffect } from "react";
import { Supplement, SupplementSchedule } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface SupplementContextType {
  supplements: Supplement[];
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (id: string, supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  schedules: SupplementSchedule[];
  markAsTaken: (scheduleId: string, taken: boolean) => void;
  getTodaySchedules: () => SupplementSchedule[];
  getSchedulesByDate: (date: Date) => SupplementSchedule[];
}

const SupplementContext = createContext<SupplementContextType | undefined>(undefined);

export function SupplementProvider({ children }: { children: React.ReactNode }) {
  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const saved = localStorage.getItem("supplements");
    return saved ? JSON.parse(saved) : [];
  });

  const [schedules, setSchedules] = useState<SupplementSchedule[]>(() => {
    const saved = localStorage.getItem("schedules");
    if (saved) {
      return JSON.parse(saved).map((schedule: any) => ({
        ...schedule,
        date: new Date(schedule.date)
      }));
    }
    return [];
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("supplements", JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  const addSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
    toast({
      title: "Supplement Added",
      description: `${supplement.name} has been added to your list.`,
    });
  };

  const updateSupplement = (id: string, updatedSupplement: Supplement) => {
    setSupplements(
      supplements.map((supp) => (supp.id === id ? updatedSupplement : supp))
    );
    
    // Also update all schedules that contain this supplement
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.supplement.id === id) {
          return {
            ...schedule,
            supplement: updatedSupplement
          };
        }
        return schedule;
      })
    );
    
    toast({
      title: "Supplement Updated",
      description: `${updatedSupplement.name} has been updated.`,
    });
  };

  const deleteSupplement = (id: string) => {
    const supplementToDelete = supplements.find(s => s.id === id);
    setSupplements(supplements.filter((supp) => supp.id !== id));
    
    // Also delete all schedules for this supplement
    setSchedules(schedules.filter((schedule) => schedule.supplement.id !== id));
    
    if (supplementToDelete) {
      toast({
        title: "Supplement Deleted",
        description: `${supplementToDelete.name} has been removed.`,
      });
    }
  };

  const markAsTaken = (scheduleId: string, taken: boolean) => {
    setSchedules(
      schedules.map((schedule) => {
        if (`${schedule.supplement.id}-${format(schedule.date, "yyyy-MM-dd")}` === scheduleId) {
          return { ...schedule, taken };
        }
        return schedule;
      })
    );
  };

  const getTodaySchedules = () => {
    const today = new Date();
    return getSchedulesByDate(today);
  };

  const getSchedulesByDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Filter existing schedules for this date
    const existingSchedules = schedules.filter(
      (schedule) => format(new Date(schedule.date), "yyyy-MM-dd") === dateStr
    );
    
    // Create missing schedules for all supplements
    const existingIds = existingSchedules.map(s => s.supplement.id);
    const missingSupplements = supplements.filter(s => !existingIds.includes(s.id));
    
    const newSchedules = missingSupplements.map(supp => ({
      supplement: supp,
      date: new Date(date),
      taken: false
    }));
    
    if (newSchedules.length > 0) {
      setSchedules([...schedules, ...newSchedules]);
    }
    
    return [...existingSchedules, ...newSchedules];
  };

  return (
    <SupplementContext.Provider
      value={{
        supplements,
        addSupplement,
        updateSupplement,
        deleteSupplement,
        schedules,
        markAsTaken,
        getTodaySchedules,
        getSchedulesByDate
      }}
    >
      {children}
    </SupplementContext.Provider>
  );
}

export const useSupplements = () => {
  const context = useContext(SupplementContext);
  if (context === undefined) {
    throw new Error("useSupplements must be used within a SupplementProvider");
  }
  return context;
};