import { type Profile } from "@shared/schema";
import ModernTemplate from "./modern-template";
import ClassicTemplate from "./classic-template";
import MinimalTemplate from "./minimal-template";

export type TemplateType = "modern" | "classic" | "minimal";

interface ProfileTemplateProps {
  profile: Partial<Profile>;
  template: TemplateType;
  onUpdatePhoto?: (url: string) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

export default function ProfileTemplate({ 
  profile, 
  template,
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: ProfileTemplateProps) {
  switch (template) {
    case "modern":
      return <ModernTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} onUpdateMatchmakerTake={onUpdateMatchmakerTake} />;
    case "classic":
      return <ClassicTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} onUpdateMatchmakerTake={onUpdateMatchmakerTake} />;
    case "minimal":
      return <MinimalTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} onUpdateMatchmakerTake={onUpdateMatchmakerTake} />;
    default:
      return <ModernTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} onUpdateMatchmakerTake={onUpdateMatchmakerTake} />;
  }
}