import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProfileForm from "@/components/profile-form";
import ProfileTemplate from "@/components/profile-templates";
import { useState } from "react";
import type { Profile } from "@shared/schema";
import type { TemplateType } from "@/components/profile-templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfileMaker() {
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

  return (
    <div className="h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dating Profile Maker</h1>
          <Select value={template} onValueChange={(value) => setTemplate(value as TemplateType)}>
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
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="p-6">
              <ProfileForm profile={profile} onChange={setProfile} />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="p-6">
              <ProfileTemplate profile={profile} template={template} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}