import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProfileForm from "@/components/profile-form";
import ProfilePreview from "@/components/profile-preview";
import { useState } from "react";
import type { Profile } from "@shared/schema";

export default function ProfileMaker() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    firstName: "",
    age: 0,
    location: "",
    occupation: "",
    education: "",
    interests: "",
    bio: "",
    photoUrl: "https://via.placeholder.com/400x400",
  });

  return (
    <div className="h-screen bg-background">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dating Profile Maker</h1>
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="p-6">
              <ProfileForm profile={profile} onChange={setProfile} />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="p-6">
              <ProfilePreview profile={profile} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
