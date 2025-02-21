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
  const { data: profiles = [] } = useQuery<Profile[]>({
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

  const [template, setTemplate] = useState<TemplateType>("modern");

  // Load profile from URL parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get('profile_id');

    if (profiles.length && profileId) {
      const selectedProfile = profiles.find(p => p.id === parseInt(profileId));
      if (selectedProfile) {
        setProfile(selectedProfile);
      }
    } else if (profiles.length) {
      setProfile(profiles[0]);
    }
  }, [profiles]);

  const handleExportPDF = () => exportToPDF("profile-template");
  const handleExportImage = () => exportToImage("profile-template");

  const handleProfileChange = (profileId: string) => {
    if (profileId === "clear") {
      setProfile({
        firstName: "",
        age: 18,
        location: "",
        occupation: "",
        education: "",
        interests: "",
        bio: "",
        photoUrl: "https://via.placeholder.com/400x400",
      });
      return;
    }

    const selectedProfile = profiles.find(p => p.id === parseInt(profileId));
    if (selectedProfile) {
      setProfile(selectedProfile);
    }
  };

  return (
    <div className="h-screen bg-background">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-4">Dating Profile Maker</h1>
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <Select
            value={profile.id?.toString() || ""}
            onValueChange={handleProfileChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  Profile: {p.firstName}
                </SelectItem>
              ))}
              <SelectItem value="clear">Clear List</SelectItem>
            </SelectContent>
          </Select>

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
                <ProfileTemplate
                  profile={profile}
                  template={template}
                  onUpdatePhoto={(url) => setProfile({ ...profile, photoUrl: url })}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}