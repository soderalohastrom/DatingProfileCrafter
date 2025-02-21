import { type Profile } from "@shared/schema";
import ModernTemplate from "./modern-template";
import ClassicTemplate from "./classic-template";
import MinimalTemplate from "./minimal-template";
import SlideTemplate from "./slide-template";

export type TemplateType = "modern" | "classic" | "minimal" | "slides";

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
    case "slides":
      return (
        <SlideTemplate 
          profile={profile} 
          onUpdatePhoto={onUpdatePhoto}
          onUpdateMatchmakerTake={onUpdateMatchmakerTake}
        />
      );
    case "modern":
      return <ModernTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} />;
    case "classic":
      return <ClassicTemplate profile={profile} />;
    case "minimal":
      return <MinimalTemplate profile={profile} />;
    default:
      return <SlideTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} />;
  }
}