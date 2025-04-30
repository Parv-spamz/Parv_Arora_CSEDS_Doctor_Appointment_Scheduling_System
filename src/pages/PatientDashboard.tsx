
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  Clock, 
  User, 
  FileText, 
  Bell, 
  Home,
  PlusCircle,
  History
} from "lucide-react";
import { PatientAppointmentList } from "@/components/PatientAppointmentList";

const PatientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">MediSchedule</span>
            </Link>
            <div className="ml-2 bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full">
              Patient View
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Alerts</span>
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Profile</span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <span className="font-medium text-sm">JP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Patient Dashboard</h1>
            <p className="text-muted-foreground">View and manage your appointments</p>
          </div>
          <div>
            <Link to="/">
              <Button variant="outline" size="sm" className="mr-3">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Book Appointment
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              <CalendarDays className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="records">
              <FileText className="h-4 w-4 mr-2" />
              Medical Records
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="animate-fade-in">
            <PatientAppointmentList />
          </TabsContent>
          
          <TabsContent value="history">
            <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Appointment History</h3>
                <p className="text-muted-foreground max-w-md">
                  View your past appointments and doctor visits.
                </p>
                <Button variant="outline" className="mt-4">
                  Show History
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="records">
            <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Medical Records</h3>
                <p className="text-muted-foreground max-w-md">
                  Access and download your medical records and test results.
                </p>
                <Button variant="outline" className="mt-4">
                  View Records
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                <p className="text-muted-foreground max-w-md">
                  Manage your SMS and email notification preferences.
                </p>
                <Button variant="outline" className="mt-4">
                  Configure
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} MediSchedule. AI-Powered Appointment System.</p>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
