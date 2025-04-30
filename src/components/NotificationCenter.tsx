
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Phone, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const NotificationCenter: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notification Center
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            SMS Enabled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="bg-muted/40 p-3 rounded-md border border-border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">SMS Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    Send SMS alerts to patients
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Automatic SMS notifications will be sent for any appointment changes.
            </div>
          </div>
          
          <div className="bg-muted/40 p-3 rounded-md border border-border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Phone Reminders</h4>
                  <p className="text-xs text-muted-foreground">
                    Automated voice calls
                  </p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Phone reminders will be made the day before appointments.
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          <h4 className="font-medium text-sm">Recent Notifications</h4>
          
          <div className="border-l-2 border-primary pl-3 py-1 space-y-1">
            <p className="text-xs font-medium">Appointment Extended</p>
            <p className="text-xs text-muted-foreground">
              John Smith's appointment was extended by 10 minutes
            </p>
            <p className="text-[10px] text-muted-foreground">2 hours ago</p>
          </div>
          
          <div className="border-l-2 border-blue-500 pl-3 py-1 space-y-1">
            <p className="text-xs font-medium">New Appointment</p>
            <p className="text-xs text-muted-foreground">
              New appointment for Sarah Johnson at 3:30 PM
            </p>
            <p className="text-[10px] text-muted-foreground">3 hours ago</p>
          </div>
          
          <div className="border-l-2 border-muted pl-3 py-1 space-y-1">
            <p className="text-xs font-medium">SMS Notifications Enabled</p>
            <p className="text-xs text-muted-foreground">
              You've successfully enabled SMS notifications
            </p>
            <p className="text-[10px] text-muted-foreground">Yesterday</p>
          </div>
        </div>
        
        <Button size="sm" variant="outline" className="w-full mt-4">
          <Bell className="h-3.5 w-3.5 mr-1" />
          View All Notifications
        </Button>
        
        <div className="text-xs text-muted-foreground text-center mt-3">
          SMS notifications powered by our AI system
        </div>
      </CardContent>
    </Card>
  );
};
