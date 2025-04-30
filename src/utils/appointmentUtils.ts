
import { format, addMinutes, parseISO, isAfter } from "date-fns";

export interface Procedure {
  id: string;
  name: string;
  duration: number; // in minutes
}

export interface Appointment {
  id: string;
  patientName: string;
  procedureId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  originalDuration: number; // in minutes
  additionalTime: number; // in minutes
}

export interface BreakSettings {
  duration: number; // in minutes
  enabled: boolean;
}

export const procedures: Procedure[] = [
  { id: "checkup", name: "Regular Checkup", duration: 15 },
  { id: "consultation", name: "Initial Consultation", duration: 30 },
  { id: "followup", name: "Follow-up Visit", duration: 20 },
  { id: "physical", name: "Complete Physical", duration: 45 },
  { id: "urgent", name: "Urgent Care", duration: 25 },
];

// Get procedure by ID
export const getProcedureById = (id: string): Procedure | undefined => {
  return procedures.find(procedure => procedure.id === id);
};

// Calculate end time based on start time and duration
export const calculateEndTime = (startTime: string, durationInMinutes: number): string => {
  const start = parseISO(startTime);
  const end = addMinutes(start, durationInMinutes);
  return end.toISOString();
};

// Generate time slots for display
export const generateTimeSlots = (startTime: Date, endTime: Date, intervalInMinutes: number = 15): string[] => {
  const slots: string[] = [];
  let current = new Date(startTime);
  
  while (current < endTime) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, intervalInMinutes);
  }
  
  return slots;
};

// Get formatted time from ISO string
export const formatTime = (isoString: string): string => {
  return format(parseISO(isoString), "h:mm a");
};

// Get formatted date from ISO string
export const formatDate = (isoString: string): string => {
  return format(parseISO(isoString), "MMMM d, yyyy");
};

// Recalculate all appointments after changes
export const recalculateAppointments = (
  appointments: Appointment[], 
  breakSettings: BreakSettings
): Appointment[] => {
  if (appointments.length === 0) return [];
  
  // Sort appointments by start time
  const sortedAppointments = [...appointments].sort((a, b) => 
    parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
  );
  
  const recalculated: Appointment[] = [];
  
  // First appointment stays as is
  recalculated.push(sortedAppointments[0]);
  
  // Recalculate the rest based on previous end time + break
  for (let i = 1; i < sortedAppointments.length; i++) {
    const previousAppointment = recalculated[i - 1];
    const currentAppointment = sortedAppointments[i];
    
    const previousEndTime = parseISO(previousAppointment.endTime);
    let newStartTime = previousEndTime;
    
    // Add break time if enabled
    if (breakSettings.enabled) {
      newStartTime = addMinutes(previousEndTime, breakSettings.duration);
    }
    
    const totalDuration = currentAppointment.originalDuration + currentAppointment.additionalTime;
    const newEndTime = addMinutes(newStartTime, totalDuration);
    
    recalculated.push({
      ...currentAppointment,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString()
    });
  }
  
  return recalculated;
};

// Generate a new unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
