
import React from "react";
import { Link } from "react-router-dom";
import AppointmentScheduler from "@/components/AppointmentScheduler";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  Clock, 
  MessageSquare, 
  Settings, 
  Users, 
  Bell,
  Home
} from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";

const DoctorDashboard: React.FC = () => {
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
            <div className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              Doctor View
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Settings</span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="font-medium text-sm">DR</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and patient schedule</p>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
            <Link to="/scheduler">
              <Button size="sm">
                <CalendarDays className="h-4 w-4 mr-1" />
                Open Scheduler
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs defaultValue="appointments">
          <TabsList className="mb-6">
            <TabsTrigger value="appointments">
              <CalendarDays className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="h-4 w-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <AppointmentScheduler />
              </div>
              <div>
                <NotificationCenter />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patients">
            <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Patient Management</h3>
                <p className="text-muted-foreground max-w-md">
                  This feature will be implemented in the future update.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">SMS Configuration</h3>
                <p className="text-muted-foreground max-w-md">
                  Configure your SMS notification settings here. Coming soon.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                <p className="text-muted-foreground max-w-md">
                  Manage your account settings, notifications, and preferences.
                </p>
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

export default DoctorDashboard;
