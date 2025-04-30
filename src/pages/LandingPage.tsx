
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarClock, 
  UserRound, 
  Stethoscope, 
  Bell, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRoleSelection = (role: 'doctor' | 'patient') => {
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/60 overflow-hidden">
      {/* 3D-like floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[10%] left-[15%] h-32 w-32 rounded-full bg-primary/10"
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3]
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut" 
          }} 
        />
        <motion.div 
          className="absolute top-[30%] right-[10%] h-24 w-24 rounded-full bg-secondary/20"
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2]
          }} 
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }} 
        />
        <motion.div 
          className="absolute bottom-[20%] left-[25%] h-40 w-40 rounded-full bg-muted/30"
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }} 
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }} 
        />
      </div>

      {/* Header */}
      <header className="pt-10 pb-6 px-6 sm:px-10 relative z-10">
        <div className="flex items-center justify-center mb-4">
          <CalendarClock className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">MediSchedule</h1>
        </div>
        <div className="flex justify-center">
          <Badge variant="outline" className="bg-secondary/50 px-3 py-1 text-sm">
            AI-Powered Appointment System
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 mt-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Smart Scheduling for Modern Healthcare
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered system automatically adjusts schedules, sends notifications, 
            and ensures the best experience for both patients and doctors.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
            <div onClick={() => handleRoleSelection('doctor')} className="bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 rounded-xl p-8 h-full transition-all duration-300 cursor-pointer group-hover:translate-y-[-5px] group-hover:shadow-lg shadow-primary/5">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 mx-auto">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">I'm a Doctor</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Manage your patient appointments</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Adjust time slots automatically</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Set break periods between visits</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Send notifications to patients</span>
                </li>
              </ul>
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="w-full">
                  Continue as Doctor
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 rounded-xl blur-xl group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
            <div onClick={() => handleRoleSelection('patient')} className="bg-card/80 backdrop-blur-sm border border-border hover:border-blue-500/50 rounded-xl p-8 h-full transition-all duration-300 cursor-pointer group-hover:translate-y-[-5px] group-hover:shadow-lg shadow-blue-500/5">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 mx-auto">
                <UserRound className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">I'm a Patient</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Book appointments online easily</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Receive SMS notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Get real-time updates on changes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Review your appointment history</span>
                </li>
              </ul>
              <div className="mt-8 flex justify-center">
                <Button variant="outline" size="lg" className="w-full">
                  Continue as Patient
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 mb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-2">Smart Scheduling</h3>
              <p className="text-muted-foreground text-sm">
                AI optimizes appointment times based on procedure types
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground text-sm">
                Automatic SMS notifications for schedule changes
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <CalendarClock className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-2">Flexible Timing</h3>
              <p className="text-muted-foreground text-sm">
                Automatically adjusts all appointments when changes occur
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-sm text-muted-foreground relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <p>© {new Date().getFullYear()} MediSchedule. AI-Powered Appointment System.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
