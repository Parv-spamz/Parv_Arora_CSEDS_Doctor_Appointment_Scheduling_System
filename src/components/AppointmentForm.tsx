
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { procedures, Procedure } from "@/utils/appointmentUtils";

interface AppointmentFormProps {
  onAddAppointment: (patientName: string, procedureId: string, startTime: string) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onAddAppointment }) => {
  const [patientName, setPatientName] = useState("");
  const [procedureId, setProcedureId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");

  const timeOptions = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  const selectedProcedure = procedures.find(p => p.id === procedureId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName.trim() || !procedureId || !date || !time) {
      return;
    }
    
    // Combine date and time to form the start time
    const [hours, minutes] = time.split(":");
    const startDateTime = new Date(date);
    startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    
    onAddAppointment(patientName, procedureId, startDateTime.toISOString());
    
    // Reset form
    setPatientName("");
    setProcedureId("");
    setTime("09:00");
  };

  return (
    <Card className="w-full glass animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-5">Add New Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              placeholder="Enter patient name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="procedureType">Procedure</Label>
            <Select
              value={procedureId}
              onValueChange={(value) => setProcedureId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select procedure" />
              </SelectTrigger>
              <SelectContent>
                {procedures.map((procedure) => (
                  <SelectItem key={procedure.id} value={procedure.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{procedure.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {procedure.duration} min
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Time</Label>
              <Select
                value={time}
                onValueChange={setTime}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(new Date(`2000-01-01T${timeOption}`), "h:mm a")}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedProcedure && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Estimated duration: {selectedProcedure.duration} minutes</span>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!patientName.trim() || !procedureId || !date || !time}
          >
            Add Appointment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
