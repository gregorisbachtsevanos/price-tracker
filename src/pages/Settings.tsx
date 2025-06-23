
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSupplements } from "@/context/SupplementContext";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { getCycleStartDate } from "@/lib/cycle-utils";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { supplements, deleteSupplement } = useSupplements();
  const { toast } = useToast();
  const cycleStartDate = getCycleStartDate();
  
  const resetCycle = () => {
    // In a real app, this would update the cycle start date
    // For now, we'll just show a toast notification
    toast({
      title: "Cycle Reset",
      description: "Your supplement cycle has been reset to today.",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>My Supplements</CardTitle>
            <CardDescription>
              Manage your supplement list
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supplements.length > 0 ? (
              <div className="space-y-3">
                {supplements.map((supplement) => (
                  <div 
                    key={supplement.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{supplement.name}</div>
                      <div className="text-sm text-muted-foreground">{supplement.dosage}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {supplement.morning && supplement.afternoon 
                          ? "Morning & Afternoon" 
                          : supplement.morning 
                            ? "Morning only" 
                            : "Afternoon only"
                        }
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a href={`/edit/${supplement.id}`}>
                          <Edit className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteSupplement(supplement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No supplements added yet
              </div>
            )}
            
            <div className="mt-4">
              <Button asChild className="w-full">
                <a href="/add">Add New Supplement</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure when you want to receive reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="morning">Morning Reminder</Label>
                  <div className="text-sm text-muted-foreground">8:00 AM</div>
                </div>
                <Switch id="morning" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="afternoon">Afternoon Reminder</Label>
                  <div className="text-sm text-muted-foreground">2:00 PM</div>
                </div>
                <Switch id="afternoon" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cycle">Cycle Transition Alert</Label>
                  <div className="text-sm text-muted-foreground">
                    Day before phase change
                  </div>
                </div>
                <Switch id="cycle" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cycle Settings</CardTitle>
            <CardDescription>
              Manage your supplement cycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Current cycle started on</div>
                <div className="font-medium">{format(cycleStartDate, "MMMM d, yyyy")}</div>
              </div>
              
              <Button variant="outline" onClick={resetCycle}>
                Reset cycle to today
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;