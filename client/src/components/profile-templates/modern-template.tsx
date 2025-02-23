import { Card, CardContent } from "@/components/ui/card";
import { type Profile } from "@shared/schema";
import { Briefcase, GraduationCap, Heart, MapPin, Image } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import { Textarea } from "@/components/ui/textarea";
import ImageCropper from "../image-cropper";

interface ModernTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Common slide wrapper component - defined before use
const SlideWrapper = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <Card 
    className="w-[1920px] h-[1080px] mx-auto mb-8 slide-page overflow-hidden" 
    id={id}
    style={{ 
      aspectRatio: '16/9',
      background: 'white'
    }}
  >
    <CardContent className="h-full p-0">
      {children}
    </CardContent>
  </Card>
);

export default function ModernTemplate({ 
  profile, 
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: ModernTemplateProps) {
  const [imageSelector, setImageSelector] = useState<{
    open: boolean;
    type: "main" | "bio" | "matchmaker" | null;
    context?: 'headshot' | 'lifestyle' | 'formal';
  }>({ open: false, type: null });

  const [matchmakerTake, setMatchmakerTake] = useState("");
  const [imagePositions, setImagePositions] = useState({
    main: { x: 0, y: 0, scale: 1 },
    bio: { x: 0, y: 0, scale: 1 },
    matchmaker: { x: 0, y: 0, scale: 1 }
  });

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto && imageSelector.type) {
      onUpdatePhoto(url);
    }
    setImageSelector({ open: false, type: null });
  };

  // Get image context based on where it's being used
  const getImageContext = (type: "main" | "bio" | "matchmaker"): 'headshot' | 'lifestyle' | 'formal' => {
    switch (type) {
      case "main":
        return 'headshot';
      case "bio":
        return 'lifestyle';
      case "matchmaker":
        return 'formal';
      default:
        return 'headshot';
    }
  };

  // Update click handlers to include context
  const handleImageClick = (type: "main" | "bio" | "matchmaker") => {
    setImageSelector({ 
      open: true, 
      type,
      context: getImageContext(type)
    });
  };

  // Render a clickable image placeholder or the actual image
  const ImagePlaceholder = ({ 
    onClick, 
    className = "",
    imageUrl = "",
    aspectRatio = 1
  }: { 
    onClick: () => void, 
    className?: string,
    imageUrl?: string,
    aspectRatio?: number
  }) => (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
      style={{ aspectRatio }}
    >
      {imageUrl ? (
        <ImageCropper
          src={imageUrl}
          placeholderClassName="w-full h-full"
          aspectRatio={aspectRatio}
          onPositionChange={(pos) => setImagePositions(prev => ({ 
            ...prev, 
            [imageSelector.type || 'main']: pos 
          }))}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
          <div className="text-center">
            <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to select image</p>
          </div>
        </div>
      )}
    </div>
  );

  // Slide 1: Main Profile
  const MainProfileSlide = (
    <SlideWrapper id="slide-1">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-16">
          <div className="flex gap-16 items-start">
            <ImagePlaceholder
              onClick={() => handleImageClick("main")}
              className="w-[300px] h-[300px] rounded-full border-4 border-white shadow-lg hover:opacity-90 transition-opacity"
              imageUrl={profile.photoUrl}
            />
            <div>
              <h2 className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {profile.firstName}, {profile.age}
              </h2>
              <div className="flex items-center gap-3 mt-6 text-muted-foreground text-2xl">
                <MapPin className="w-8 h-8" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-16 space-y-16">
          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary">
                <Briefcase className="w-10 h-10" />
                <h3 className="text-3xl font-semibold">Career</h3>
              </div>
              <p className="text-2xl">{profile.occupation}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary">
                <GraduationCap className="w-10 h-10" />
                <h3 className="text-3xl font-semibold">Education</h3>
              </div>
              <p className="text-2xl">{profile.education}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-primary">
              <Heart className="w-10 h-10" />
              <h3 className="text-3xl font-semibold">Interests</h3>
            </div>
            <p className="text-2xl">{profile.interests}</p>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 2: Bio and Secondary Photo
  const BioSlide = (
    <SlideWrapper id="slide-2">
      <div className="h-full grid" style={{ gridTemplateColumns: '3fr 1fr' }}>
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-semibold">About Me</h3>
          <p className="text-2xl text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          <ImagePlaceholder
            onClick={() => handleImageClick("bio")}
            className="w-[400px] h-[400px] rounded-lg hover:opacity-90 transition-opacity"
            imageUrl={profile.photoUrl}
          />
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 3: Matchmaker's Take
  const MatchmakerSlide = (
    <SlideWrapper id="slide-3">
      <div className="h-full grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <ImagePlaceholder
          onClick={() => handleImageClick("matchmaker")}
          className="w-full h-full"
          imageUrl={profile.photoUrl}
          aspectRatio={9/16}
        />
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-semibold">Matchmaker's Take</h3>
          <Textarea
            className="w-full h-[800px] text-2xl p-8"
            placeholder="Enter matchmaker's observations..."
            value={matchmakerTake}
            onChange={(e) => {
              setMatchmakerTake(e.target.value);
              if (onUpdateMatchmakerTake) {
                onUpdateMatchmakerTake(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </SlideWrapper>
  );

  return (
    <>
      <div className="space-y-8">
        {MainProfileSlide}
        {BioSlide}
        {MatchmakerSlide}
      </div>

      <ImageSelector
        open={imageSelector.open}
        onOpenChange={(open) => !open && setImageSelector({ open: false, type: null })}
        onSelect={handleImageSelect}
        context={imageSelector.context}
      />
    </>
  );
}