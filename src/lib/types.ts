
export interface Supplement {
    id: string;
    name: string;
    morning: boolean;
    afternoon: boolean;
    dosage: string;
    color?: string;
    morningTime?: string | null;
    afternoonTime?: string | null;
  }
  
  export interface SupplementSchedule {
    supplement: Supplement;
    date: Date;
    taken: boolean;
  }
  
  export type CyclePhase = 
    | "regular" // Weeks 1-6: Regular dosage
    | "reduced" // Week 7: Reduced dosage
    | "break"   // Weeks 8-9: No supplements
    | "restart" // Week 10: Slowly restart
  