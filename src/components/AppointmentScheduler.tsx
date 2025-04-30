
import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Appointment, 
  BreakSettings, 
  calculateEndTime, 
  generateId, 
  getProcedureById, 
  recalculateAppointments
} from "@/utils/appointmentUtils";
import AppointmentForm from "./AppointmentForm";
import AppointmentCalendar from "./AppointmentCalendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock } from "lucide-react";

const AppointmentScheduler: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [breakSettings, setBreakSettings] = useState<BreakSettings>({
    duration: 5,
    enabled: true,
  });

  const handleAddAppointment = (patientName: string, procedureId: string, startTime: string) => {
    const procedure = getProcedureById(procedureId);
    
    if (!procedure) {
      toast.error("Invalid procedure selected");
      return;
    }
    
    const newAppointment: Appointment = {
      id: generateId(),
      patientName,
      procedureId,
      startTime,
      endTime: calculateEndTime(startTime, procedure.duration),
      originalDuration: procedure.duration,
      additionalTime: 0,
    };
    
    const updatedAppointments = [...appointments, newAppointment];
    const recalculatedAppointments = recalculateAppointments(updatedAppointments, breakSettings);
    
    setAppointments(recalculatedAppointments);
    toast.success("Appointment added successfully");
  };

  const handleAddTime = (appointmentId: string) => {
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          additionalTime: appointment.additionalTime + 5,
        };
      }
      return appointment;
    });
    
    const recalculatedAppointments = recalculateAppointments(updatedAppointments, breakSettings);
    setAppointments(recalculatedAppointments);
    toast.success("Added 5 minutes to appointment");
  };

  const handleReduceTime = (appointmentId: string) => {
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId && appointment.additionalTime > 0) {
        return {
          ...appointment,
          additionalTime: appointment.additionalTime - 5,
        };
      }
      return appointment;
    });
    
    const recalculatedAppointments = recalculateAppointments(updatedAppointments, breakSettings);
    setAppointments(recalculatedAppointments);
    toast.success("Removed 5 minutes from appointment");
  };

  const handleClearSchedule = () => {
    setAppointments([]);
    toast.info("Schedule cleared");
  };

  const handleBreakSettingsChange = (settings: Partial<BreakSettings>) => {
    const newSettings = { ...breakSettings, ...settings };
    setBreakSettings(newSettings);
    
    // Recalculate appointments with new break settings
    if (appointments.length > 0) {
      const recalculatedAppointments = recalculateAppointments(appointments, newSettings);
      setAppointments(recalculatedAppointments);
      toast.success("Schedule updated with new break settings");
    }
  };

  return (
    <div className="w-full mx-auto max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AppointmentForm onAddAppointment={handleAddAppointment} />
          
          <div className="mt-6 p-5 bg-secondary/50 rounded-lg border border-border animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Settings</h3>
              {appointments.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearSchedule}>
                  Clear Schedule
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Break Between Appointments</Label>
                  <p className="text-sm text-muted-foreground">
                    Add buffer time between appointments
                  </p>
                </div>
                <Switch 
                  checked={breakSettings.enabled}
                  onCheckedChange={(checked) => 
                    handleBreakSettingsChange({ enabled: checked })
                  }
                />
              </div>
              
              {breakSettings.enabled && (
                <div className="flex items-center gap-4">
                  <Label className="text-sm">Break Duration:</Label>
                  <Select
                    value={breakSettings.duration.toString()}
                    onValueChange={(value) => 
                      handleBreakSettingsChange({ duration: parseInt(value, 10) })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-2" />
                          <span>5 minutes</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="10">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-2" />
                          <span>10 minutes</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="15">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-2" />
                          <span>15 minutes</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <AppointmentCalendar 
            appointments={appointments}
            onAddTime={handleAddTime}
            onReduceTime={handleReduceTime}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
