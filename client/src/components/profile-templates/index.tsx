import { type Profile } from "@shared/schema";
import ModernTemplate from "./modern-template";
import ClassicTemplate from "./classic-template";
import MinimalTemplate from "./minimal-template";

export type TemplateType = "modern" | "classic" | "minimal";

interface ProfileTemplateProps {
  profile: Partial<Profile>;
  template: TemplateType;
}

export default function ProfileTemplate({ profile, template }: ProfileTemplateProps) {
  switch (template) {
    case "modern":
      return <ModernTemplate profile={profile} />;
    case "classic":
      return <ClassicTemplate profile={profile} />;
    case "minimal":
      return <MinimalTemplate profile={profile} />;
    default:
      return <ModernTemplate profile={profile} />;
  }
}
