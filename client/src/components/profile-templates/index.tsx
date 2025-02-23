import { type Profile, type Theme } from "@shared/schema";
import ModernTemplate from "./modern-template";
import ClassicTemplate from "./classic-template";
import MinimalTemplate from "./minimal-template";
import CustomTemplate from "./custom-template";
import { useQuery } from "@tanstack/react-query";

export type TemplateType = "modern" | "classic" | "minimal" | string;

interface ProfileTemplateProps {
  profile: Partial<Profile>;
  template: TemplateType;
  onUpdatePhoto?: (url: string, slideNumber: number) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

export default function ProfileTemplate({ 
  profile, 
  template,
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: ProfileTemplateProps) {
  const { data: themes = [] } = useQuery<Theme[]>({
    queryKey: ["/api/admin/themes"],
  });

  // Handle custom templates - temporarily disabled
  if (false && typeof template === 'string' && template.startsWith('custom_')) {
    const themeId = parseInt(template.split('_')[1]);
    const customTheme = themes.find(t => t.id === themeId);

    if (customTheme) {
      return (
        <CustomTemplate 
          profile={profile} 
          theme={customTheme}
          onUpdatePhoto={onUpdatePhoto}
          onUpdateMatchmakerTake={onUpdateMatchmakerTake}
        />
      );
    }
  }

  // Handle built-in templates with consistent slide-based image handling
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