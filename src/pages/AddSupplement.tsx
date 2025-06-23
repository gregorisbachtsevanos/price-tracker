
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSupplements } from "@/context/SupplementContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const AddSupplement = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [morningTime, setMorningTime] = useState("08:00");
  const [afternoonTime, setAfternoonTime] = useState("14:00");
  
  const { addSupplement } = useSupplements();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !dosage.trim()) {
      return;
    }
    
    addSupplement({
      id: uuidv4(),
      name,
      dosage,
      morning,
      afternoon,
      morningTime: morning ? morningTime : null,
      afternoonTime: afternoon ? afternoonTime : null
    });
    
    navigate("/");
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Supplement</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Supplement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Vitamin D3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="1000 IU"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Schedule</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center">
                    <Label htmlFor="morning" className="cursor-pointer">Morning</Label>
                    <Switch
                      id="morning"
                      checked={morning}
                      onCheckedChange={setMorning}
                      className="ml-2"
                    />
                  </div>
                  {morning && (
                    <div className="flex items-center ml-4">
                      <Label htmlFor="morningTime" className="mr-2 text-sm">Time:</Label>
                      <Input
                        id="morningTime"
                        type="time"
                        value={morningTime}
                        onChange={(e) => setMorningTime(e.target.value)}
                        className="w-24 text-sm"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center">
                    <Label htmlFor="afternoon" className="cursor-pointer">Afternoon</Label>
                    <Switch
                      id="afternoon"
                      checked={afternoon}
                      onCheckedChange={setAfternoon}
                      className="ml-2"
                    />
                  </div>
                  {afternoon && (
                    <div className="flex items-center ml-4">
                      <Label htmlFor="afternoonTime" className="mr-2 text-sm">Time:</Label>
                      <Input
                        id="afternoonTime"
                        type="time"
                        value={afternoonTime}
                        onChange={(e) => setAfternoonTime(e.target.value)}
                        className="w-24 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Add Supplement
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddSupplement;
