import { type Profile, type Theme, type SlideElement } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomTemplateProps {
  profile: Partial<Profile>;
  theme: Theme;
  onUpdatePhoto?: (url: string) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Mapping function for profile field placeholders
function mapProfileToContent(content: string | null, profile: Partial<Profile>, elementName?: string): string {
  if (!content) return '';

  // If this is a named element, use its value from the profile
  if (elementName && profile[elementName as keyof Profile] !== undefined) {
    return String(profile[elementName as keyof Profile]);
  }

  // Define mappings between placeholders and profile fields
  const mappings: Record<string, string | number | undefined> = {
    '{firstName}': profile.firstName,
    '{age}': profile.age,
    '{location}': profile.location,
    '{occupation}': profile.occupation,
    '{education}': profile.education,
    '{interests}': profile.interests,
    '{bio}': profile.bio,
  };

  // Replace all placeholders with actual values
  return Object.entries(mappings).reduce(
    (text, [placeholder, value]) => text.replace(placeholder, String(value || '')),
    content
  );
}

export default function CustomTemplate({
  profile,
  theme,
  onUpdatePhoto,
  onUpdateMatchmakerTake,
}: CustomTemplateProps) {
  // Fetch elements for all slides
  const slideElements = [1, 2, 3].map(slideNumber => {
    const { data: elements = [] } = useQuery<SlideElement[]>({
      queryKey: [`/api/admin/themes/${theme.id}/slides/${slideNumber}/elements`],
    });
    return elements;
  });

  return (
    <Tabs defaultValue="slide1" className="w-full">
      <TabsList className="hidden">
        <TabsTrigger value="slide1">Slide 1</TabsTrigger>
        <TabsTrigger value="slide2">Slide 2</TabsTrigger>
        <TabsTrigger value="slide3">Slide 3</TabsTrigger>
      </TabsList>

      {[1, 2, 3].map((slideNumber, index) => (
        <TabsContent
          key={slideNumber}
          value={`slide${slideNumber}`}
          className="w-[1920px] h-[1080px] relative"
          style={{
            backgroundImage: `url(${theme.backgroundImages[`slide${slideNumber}` as keyof Theme['backgroundImages']]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {slideElements[index].map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.position.width,
                height: element.position.height,
                ...element.properties,
              }}
            >
              {element.elementType === "image" ? (
                <img
                  src={element.content || ''}
                  alt="Element"
                  className="w-full h-full object-cover"
                  style={{ borderRadius: element.properties.borderRadius }}
                />
              ) : element.elementType === "text" ? (
                // Handle text elements with properties.name for custom fields
                mapProfileToContent(element.content, profile, element.properties.name)
              ) : (
                // Handle freeform text elements directly
                element.content
              )}
            </div>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}