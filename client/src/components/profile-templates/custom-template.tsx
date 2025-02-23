import { type Profile, type Theme, type SlideElement } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "lucide-react";
import ImageSelector from "../image-selector";
import ImageCropper from "../image-cropper";
import { useState } from "react";

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
}: CustomTemplateProps) {
  const [imageSelector, setImageSelector] = useState<{
    open: boolean;
    type: "placeholder" | null;
  }>({ open: false, type: null });

  const [imagePositions, setImagePositions] = useState<Record<number, { x: number; y: number; scale: number }>>({});

  // Fetch elements for all slides
  const slideElements = [1, 2, 3].map(slideNumber => {
    const { data: elements = [] } = useQuery<SlideElement[]>({
      queryKey: [`/api/admin/themes/${theme.id}/slides/${slideNumber}/elements`],
    });
    return elements;
  });

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto && imageSelector.type === "placeholder") {
      onUpdatePhoto(url);
    }
    setImageSelector({ open: false, type: null });
  };

  // Render an image element based on its properties
  const renderImageElement = (element: SlideElement) => {
    const isPlaceholder = element.properties.isPlaceholder;
    const hasImage = profile.photoUrl && !isPlaceholder;

    if (hasImage) {
      return (
        <ImageCropper
          src={profile.photoUrl}
          placeholderClassName="w-full h-full"
          style={{ borderRadius: element.properties.borderRadius }}
          position={imagePositions[element.id] || { x: 0, y: 0, scale: 1 }}
          onPositionChange={(pos) => 
            setImagePositions(prev => ({ 
              ...prev, 
              [element.id]: pos 
            }))
          }
        />
      );
    }

    // Render placeholder that can be clicked
    return (
      <div
        className="w-full h-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground cursor-pointer"
        onClick={() => setImageSelector({ open: true, type: "placeholder" })}
        style={{ borderRadius: element.properties.borderRadius }}
      >
        <div className="text-center">
          <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Click to select image</p>
        </div>
      </div>
    );
  };

  return (
    <>
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
              backgroundImage: theme.backgroundImages?.[`slide${slideNumber}` as keyof Theme['backgroundImages']] 
                ? `url(${theme.backgroundImages[`slide${slideNumber}` as keyof Theme['backgroundImages']]})` 
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {slideElements[index].map((element) => (
              <div
                key={element.id}
                className="absolute overflow-hidden"
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.position.width,
                  height: element.position.height,
                  ...element.properties,
                }}
              >
                {element.elementType === "image" ? (
                  renderImageElement(element)
                ) : element.elementType === "text" ? (
                  mapProfileToContent(element.content, profile, element.properties.name)
                ) : (
                  element.content
                )}
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <ImageSelector
        open={imageSelector.open}
        onOpenChange={(open) => !open && setImageSelector({ open: false, type: null })}
        onSelect={handleImageSelect}
      />
    </>
  );
}