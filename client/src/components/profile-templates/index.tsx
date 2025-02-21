import { type Profile } from "@shared/schema";
import ModernTemplate from "./modern-template";
import ClassicTemplate from "./classic-template";
import MinimalTemplate from "./minimal-template";

export type TemplateType = "modern" | "classic" | "minimal";

interface ProfileTemplateProps {
  profile: Partial<Profile>;
  template: TemplateType;
  onUpdatePhoto?: (url: string) => void;
}

export default function ProfileTemplate({ profile, template, onUpdatePhoto }: ProfileTemplateProps) {
  switch (template) {
    case "modern":
      return <ModernTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} />;
    case "classic":
      return <ClassicTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} />;
    case "minimal":
      return <MinimalTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} />;
    default:
      return <ModernTemplate profile={profile} onUpdatePhoto={onUpdatePhoto} />;
  }
}