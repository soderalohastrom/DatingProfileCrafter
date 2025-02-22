import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProfileForm from "@/components/profile-form";
import ProfileTemplate from "@/components/profile-templates";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { useState, useEffect } from "react";
import type { Profile, Theme } from "@shared/schema";
import type { TemplateType } from "@/components/profile-templates";
import { exportToPDF, exportToImages } from "@/lib/export-utils";
import { triggerConfetti } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

export default function ProfileMaker() {
  const [, setLocation] = useLocation();
  const { data: profiles = [] } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  const { data: customThemes = [] } = useQuery<Theme[]>({
    queryKey: ["/api/admin/themes"],
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

  const [template, setTemplate] = useState<TemplateType | string>("modern");
  const [matchmakerTake, setMatchmakerTake] = useState("");

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

  const handleExportPDF = async () => {
    await exportToPDF();
    triggerConfetti();
  };

  const handleExportImages = async () => {
    await exportToImages();
    triggerConfetti();
  };

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

  const handleTemplateChange = (value: string) => {
    if (value === "edit_templates") {
      setLocation("/admin/templates");
      return;
    }
    setTemplate(value);
  };

  // Extract theme ID from template value if it's a custom template
  const getThemeId = () => {
    if (typeof template === 'string' && template.startsWith('custom_')) {
      return parseInt(template.split('_')[1]);
    }
    return undefined;
  };

  const isBuiltInTemplate = (template: string): boolean => {
    return ["modern", "classic", "minimal"].includes(template);
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
            onClick={handleExportImages}
            className="flex items-center gap-2"
          >
            <Image className="w-4 h-4" />
            Export PNGs
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
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {/* Built-in templates */}
              <SelectItem value="modern">Modern Template</SelectItem>
              <SelectItem value="classic">Classic Template</SelectItem>
              <SelectItem value="minimal">Minimal Template</SelectItem>

              {/* Custom templates */}
              {customThemes.length > 0 && (
                <>
                  <SelectItem value="divider" disabled>
                    ── Custom Templates ──
                  </SelectItem>
                  {customThemes.map((theme) => (
                    <SelectItem key={theme.id} value={`custom_${theme.id}`}>
                      {theme.name || "Untitled Theme"}
                    </SelectItem>
                  ))}
                </>
              )}

              {/* Edit Templates option */}
              <SelectItem value="divider2" disabled>
                ──────────────
              </SelectItem>
              <SelectItem value="edit_templates">Edit Templates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[800px] rounded-lg border"
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="p-6">
              <ProfileForm
                profile={profile}
                onChange={setProfile}
                templateId={getThemeId()}
                isBuiltInTemplate={isBuiltInTemplate(template)}
              />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="p-6 overflow-auto">
              <div
                id="profile-template"
                className="transform origin-top-left"
                style={{
                  width: '1920px',
                  height: 'auto',
                  transformOrigin: 'top left',
                  transform: 'scale(0.4)',
                  marginBottom: '-60%',
                  imageRendering: 'crisp-edges'
                }}
              >
                <ProfileTemplate
                  profile={profile}
                  template={template}
                  onUpdatePhoto={(url) => setProfile({ ...profile, photoUrl: url })}
                  onUpdateMatchmakerTake={setMatchmakerTake}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}