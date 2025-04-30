
import React from "react";
import { Clock, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment, formatTime, getProcedureById } from "@/utils/appointmentUtils";

interface AppointmentCardProps {
  appointment: Appointment;
  onAddTime: (appointmentId: string) => void;
  onReduceTime: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAddTime,
  onReduceTime,
}) => {
  const procedure = getProcedureById(appointment.procedureId);
  const totalDuration = appointment.originalDuration + appointment.additionalTime;

  return (
    <Card className="w-full mb-4 overflow-hidden hover-scale animate-fade-in glass">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{appointment.patientName}</h3>
            <div className="text-muted-foreground text-sm">{procedure?.name}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-center min-w-[60px]">
              {totalDuration} min
              {appointment.additionalTime > 0 && (
                <span className="text-xs text-muted-foreground block">
                  (+{appointment.additionalTime})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => onReduceTime(appointment.id)}
                disabled={appointment.additionalTime <= 0}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => onAddTime(appointment.id)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
