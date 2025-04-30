
import React from "react";
import { Appointment, formatDate, formatTime } from "@/utils/appointmentUtils";
import AppointmentCard from "./AppointmentCard";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAddTime: (appointmentId: string) => void;
  onReduceTime: (appointmentId: string) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAddTime,
  onReduceTime,
}) => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-secondary/30 rounded-md border border-border mt-8 animate-fade-in">
        <CalendarIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="text-xl font-medium text-muted-foreground/70">No Appointments</h3>
        <p className="text-muted-foreground text-sm">
          Add a new appointment using the form above
        </p>
      </div>
    );
  }

  // Sort appointments by start time
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Get the current date from the first appointment
  const currentDate = sortedAppointments.length > 0 
    ? formatDate(sortedAppointments[0].startTime) 
    : "Today";

  // Get the schedule start and end times
  const scheduleStart = sortedAppointments.length > 0 
    ? formatTime(sortedAppointments[0].startTime)
    : "";
  
  const scheduleEnd = sortedAppointments.length > 0 
    ? formatTime(sortedAppointments[sortedAppointments.length - 1].endTime)
    : "";

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-primary font-medium">Today's Schedule</div>
          <h2 className="text-2xl font-medium mb-0">{currentDate}</h2>
          {sortedAppointments.length > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              {scheduleStart} - {scheduleEnd}
            </div>
          )}
        </div>
        <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm font-medium">
          {sortedAppointments.length} Appointment{sortedAppointments.length !== 1 ? "s" : ""}
        </div>
      </div>
      
      <Separator className="mb-6" />
      
      <div className="space-y-4">
        {sortedAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onAddTime={onAddTime}
            onReduceTime={onReduceTime}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
