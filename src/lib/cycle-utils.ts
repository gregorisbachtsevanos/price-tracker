
import { addDays, addWeeks, format, startOfWeek, isAfter, isBefore, differenceInWeeks } from "date-fns";
import { CyclePhase } from "./types";

// Define cycle durations in weeks
const REGULAR_PHASE_WEEKS = 6;
const REDUCED_PHASE_WEEKS = 1;
const BREAK_PHASE_WEEKS = 2;
const RESTART_PHASE_WEEKS = 1;
const TOTAL_CYCLE_WEEKS = REGULAR_PHASE_WEEKS + REDUCED_PHASE_WEEKS + BREAK_PHASE_WEEKS + RESTART_PHASE_WEEKS;

export function getCycleStartDate(referenceDate: Date = new Date()): Date {
  // Get first day of the current cycle
  const cycleStartDate = startOfWeek(referenceDate);
  const weeksDiff = differenceInWeeks(referenceDate, cycleStartDate) % TOTAL_CYCLE_WEEKS;
  return addWeeks(cycleStartDate, -weeksDiff);
}

export function getCurrentPhase(date: Date = new Date()): CyclePhase {
  const cycleStartDate = getCycleStartDate(date);
  
  // Calculate week boundaries for each phase
  const reducedPhaseStart = addWeeks(cycleStartDate, REGULAR_PHASE_WEEKS);
  const breakPhaseStart = addWeeks(reducedPhaseStart, REDUCED_PHASE_WEEKS);
  const restartPhaseStart = addWeeks(breakPhaseStart, BREAK_PHASE_WEEKS);
  const nextCycleStart = addWeeks(restartPhaseStart, RESTART_PHASE_WEEKS);
  
  if (isAfter(date, restartPhaseStart) && isBefore(date, nextCycleStart)) {
    return "restart";
  } else if (isAfter(date, breakPhaseStart) && isBefore(date, restartPhaseStart)) {
    return "break";
  } else if (isAfter(date, reducedPhaseStart) && isBefore(date, breakPhaseStart)) {
    return "reduced";
  } else {
    return "regular";
  }
}

export function getDosageModifier(phase: CyclePhase): number {
  switch (phase) {
    case "regular": return 1;    // 100% dosage
    case "reduced": return 0.5;  // 50% dosage
    case "break": return 0;      // 0% dosage
    case "restart": return 0.25; // 25% dosage
    default: return 1;
  }
}

export function getPhaseDescription(phase: CyclePhase): string {
  switch (phase) {
    case "regular": return "Regular dosage";
    case "reduced": return "Reduced dosage (50%)";
    case "break": return "Break period (no supplements)";
    case "restart": return "Restart period (25% dosage)";
    default: return "Unknown phase";
  }
}

export function getCycleWeek(date: Date = new Date()): number {
  const cycleStartDate = getCycleStartDate(date);
  return differenceInWeeks(date, cycleStartDate) % TOTAL_CYCLE_WEEKS + 1;
}

export function getNextPhaseDate(date: Date = new Date()): Date {
  const phase = getCurrentPhase(date);
  const cycleStartDate = getCycleStartDate(date);
  
  switch (phase) {
    case "regular":
      return addWeeks(cycleStartDate, REGULAR_PHASE_WEEKS);
    case "reduced":
      return addWeeks(cycleStartDate, REGULAR_PHASE_WEEKS + REDUCED_PHASE_WEEKS);
    case "break":
      return addWeeks(cycleStartDate, REGULAR_PHASE_WEEKS + REDUCED_PHASE_WEEKS + BREAK_PHASE_WEEKS);
    case "restart":
      return addWeeks(cycleStartDate, TOTAL_CYCLE_WEEKS);
    default:
      return addWeeks(date, 1);
  }
}