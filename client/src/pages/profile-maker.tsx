import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProfileForm from "@/components/profile-form";
import ProfileTemplate from "@/components/profile-templates";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { useState, useEffect } from "react";
import type { Profile } from "@shared/schema";
import type { TemplateType } from "@/components/profile-templates";
import { exportToPDF, exportToImage } from "@/lib/export-utils";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfileMaker() {
  const { data: profiles } = useQuery({
    queryKey: ["/api/profiles"],
  });

  const [profile, setProfile] = useState<Partial<Profile>>({
    firstName: "",
    age: 18,
    location: "",
    occupation: "",
    education: "",
    interests: "",
    bio: "",
    photoUrl: "https://via.placeholder.com/400x400",
  });

  // Load the first profile when data is available
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setProfile(profiles[0]);
    }
  }, [profiles]);

  const [template, setTemplate] = useState<TemplateType>("modern");

  const handleExportPDF = () => exportToPDF("profile-template");
  const handleExportImage = () => exportToImage("profile-template");

  return (
    <div className="h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dating Profile Maker</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleExportImage}
              className="flex items-center gap-2"
            >
              <Image className="w-4 h-4" />
              Export PNG
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Select
              value={template}
              onValueChange={(value) => setTemplate(value as TemplateType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern Template</SelectItem>
                <SelectItem value="classic">Classic Template</SelectItem>
                <SelectItem value="minimal">Minimal Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[800px] rounded-lg border"
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="p-6">
              <ProfileForm profile={profile} onChange={setProfile} />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="p-6">
              <div id="profile-template">
                <ProfileTemplate profile={profile} template={template} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}