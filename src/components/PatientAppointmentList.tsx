
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  MessageCircle,
  CalendarCheck
} from "lucide-react";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

// Mock data
const appointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Emily Chen",
    specialty: "Cardiologist",
    date: "May 15, 2023",
    time: "10:30 AM",
    duration: 30,
    location: "Medical Center, Floor 3, Room 305",
    status: "confirmed"
  },
  {
    id: "2",
    doctorName: "Dr. James Wilson",
    specialty: "Neurologist",
    date: "May 18, 2023",
    time: "2:45 PM",
    duration: 45,
    location: "North Medical Building, Floor 5, Room 512",
    status: "pending"
  }
];

// Helper function to get status badge color
const getStatusColor = (status: Appointment["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const PatientAppointmentList: React.FC = () => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-secondary/30 rounded-md border border-border mt-8 animate-fade-in">
        <Calendar className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="text-xl font-medium text-muted-foreground/70">No Appointments</h3>
        <p className="text-muted-foreground text-sm mb-6">
          You don't have any upcoming appointments
        </p>
        <Button>
          Book Your First Appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Upcoming Appointments</h3>
        <Button size="sm">
          <CalendarCheck className="h-4 w-4 mr-1" />
          Book New
        </Button>
      </div>
      
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="overflow-hidden hover-scale animate-fade-in glass">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 bg-primary/5 p-5 flex flex-col justify-center items-center text-center">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <div className="text-2xl font-bold">{appointment.time}</div>
                <div className="text-sm text-muted-foreground">{appointment.date}</div>
                <div className="mt-2 text-xs px-2 py-1 rounded-full border capitalize 
                  ${getStatusColor(appointment.status)}">
                  {appointment.status}
                </div>
              </div>
              
              <div className="p-5 md:w-3/4">
                <div className="flex justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{appointment.doctorName}</h4>
                    <div className="text-sm text-muted-foreground">{appointment.specialty}</div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Duration: {appointment.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                    Cancel
                  </Button>
                  <Button size="sm">Check In Online</Button>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  You'll receive an SMS reminder 24 hours before your appointment
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-medium mb-4">Need Help?</h3>
        <div className="bg-muted/30 p-4 rounded-lg border border-border">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Contact Support</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Having trouble with your appointments? Our support team is here to help.
              </p>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
