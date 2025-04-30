
import React from "react";
import AppointmentScheduler from "@/components/AppointmentScheduler";
import { Clock } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <header className="max-w-5xl mx-auto mb-10 animate-slide-down">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium text-primary">Doctor Schedule</div>
        </div>
        <h1 className="text-3xl md:text-4xl font-medium mb-2">AI Appointment Scheduler</h1>
        <p className="text-muted-foreground max-w-2xl">
          Efficiently manage your medical appointments with automatic time adjustments. 
          Add patients, select procedures, and the system will handle the scheduling.
        </p>
      </header>
      
      <main className="pb-16">
        <AppointmentScheduler />
      </main>
      
      <footer className="text-center text-sm text-muted-foreground py-6 border-t mt-12">
        <div className="max-w-5xl mx-auto">
          <p>© {new Date().getFullYear()} AI Appointment Scheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
