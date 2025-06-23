
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSupplements } from "@/context/SupplementContext";
import { useNavigate, useParams } from "react-router-dom";

const EditSupplement = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  
  const { supplements, updateSupplement } = useSupplements();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    if (id) {
      const supplement = supplements.find(s => s.id === id);
      if (supplement) {
        setName(supplement.name);
        setDosage(supplement.dosage);
        setMorning(supplement.morning);
        setAfternoon(supplement.afternoon);
      } else {
        navigate("/settings");
      }
    }
  }, [id, supplements, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !dosage.trim() || !id) {
      return;
    }
    
    updateSupplement(id, {
      id,
      name,
      dosage,
      morning,
      afternoon
    });
    
    navigate("/settings");
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Supplement</h1>
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
                  <Label htmlFor="morning" className="cursor-pointer">Morning</Label>
                  <Switch
                    id="morning"
                    checked={morning}
                    onCheckedChange={setMorning}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="afternoon" className="cursor-pointer">Afternoon</Label>
                  <Switch
                    id="afternoon"
                    checked={afternoon}
                    onCheckedChange={setAfternoon}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/settings")} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditSupplement;