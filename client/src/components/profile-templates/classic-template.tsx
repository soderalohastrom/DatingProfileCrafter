import { Card, CardContent } from "@/components/ui/card";
import { type Profile } from "@shared/schema";
import { Camera } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import { Textarea } from "@/components/ui/textarea";
import ImageCropper from "../image-cropper";

// Import background images
import backgroundLogo from "@/assets/backgrounds/classic/background_logo.png";
import backgroundBlank from "@/assets/backgrounds/classic/background_blank.png";

interface ClassicTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string, slideNumber: number) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Common slide wrapper component
const SlideWrapper = ({ children, id, background }: { children: React.ReactNode; id: string; background: string }) => (
  <Card 
    className="w-[1920px] h-[1080px] mx-auto mb-8 slide-page overflow-hidden" 
    id={id}
    style={{ 
      aspectRatio: '16/9',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <CardContent className="h-full p-0">
      {children}
    </CardContent>
  </Card>
);

export default function ClassicTemplate({ 
  profile, 
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: ClassicTemplateProps) {
  const [imageSelector, setImageSelector] = useState<{
    open: boolean;
    slideNumber: number | null;
  }>({ open: false, slideNumber: null });
  const [matchmakerTake, setMatchmakerTake] = useState("");

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto && imageSelector.slideNumber !== null) {
      onUpdatePhoto(url, imageSelector.slideNumber);
    }
    setImageSelector({ open: false, slideNumber: null });
  };

  // Get image URL based on slide number
  const getImageUrl = (slideNumber: number): string | undefined => {
    switch (slideNumber) {
      case 1:
        return profile.slide1PhotoUrl ?? undefined;
      case 2:
        return profile.slide2PhotoUrl ?? undefined;
      case 3:
        return profile.slide3PhotoUrl ?? undefined;
      default:
        return undefined;
    }
  };

  // Get image position based on slide number
  const getImagePosition = (slideNumber: number) => {
    return profile.slideImagePositions?.[slideNumber] || { x: 0, y: 0, scale: 1 };
  };

  // Render a clickable image placeholder or cropped image
  const ImagePlaceholder = ({ 
    onClick, 
    className = "", 
    slideNumber 
  }: { 
    onClick: () => void;
    className?: string;
    slideNumber: number;
  }) => (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      {getImageUrl(slideNumber) ? (
        <ImageCropper
          src={getImageUrl(slideNumber)!}
          placeholderClassName="w-full h-full"
          position={getImagePosition(slideNumber)}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
          <div className="text-center">
            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to select image</p>
          </div>
        </div>
      )}
    </div>
  );

  // Slide 1: Main Profile with Logo Background
  const MainProfileSlide = (
    <SlideWrapper id="slide-1" background={backgroundLogo}>
      <div className="h-full p-16">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-black text-white px-8 py-4 rounded">
            <div className="text-4xl font-bold tracking-wide">K KELLEHER.</div>
            <div className="text-sm text-center tracking-widest">MATCHMAKING</div>
          </div>
        </div>

        <div className="flex gap-24">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-center">
            <ImagePlaceholder 
              className="w-[400px] h-[400px] mb-12 rounded-full border-4 border-white shadow-lg hover:opacity-90 transition-opacity overflow-hidden"
              onClick={() => setImageSelector({ open: true, slideNumber: 1 })}
              slideNumber={1}
            />

            <div className="text-center">
              <h1 className="text-8xl font-light tracking-wide mb-6">
                {profile.firstName || "Name"}
              </h1>
              <h2 className="text-3xl font-light tracking-widest text-muted-foreground uppercase">
                {profile.location || "Location"}
              </h2>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-16 pt-[400px]">
            <div>
              <h3 className="text-2xl uppercase tracking-wider text-muted-foreground mb-4">Education</h3>
              <p className="text-3xl">{profile.education || "Education details"}</p>
            </div>

            <div>
              <h3 className="text-2xl uppercase tracking-wider text-muted-foreground mb-4">Profession</h3>
              <p className="text-3xl">{profile.occupation || "Professional details"}</p>
            </div>

            <div>
              <h3 className="text-2xl uppercase tracking-wider text-muted-foreground mb-4">Interests</h3>
              <p className="text-3xl">{profile.interests || "Interest details"}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground uppercase tracking-widest">
          CHAIRMAN GROUP · www.kelleher-international.com
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 2: Bio and Secondary Photo
  const BioSlide = (
    <SlideWrapper id="slide-2" background={backgroundBlank}>
      <div className="h-full grid" style={{ gridTemplateColumns: '3fr 1fr' }}>
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-light uppercase tracking-wide mb-8">Biography</h3>
          <p className="text-2xl text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
        </div>
        <div className="flex items-center justify-center bg-black/5">
          <ImagePlaceholder 
            className="w-[400px] h-[400px] hover:opacity-90 transition-opacity overflow-hidden"
            onClick={() => setImageSelector({ open: true, slideNumber: 2 })}
            slideNumber={2}
          />
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 3: Matchmaker's Take
  const MatchmakerSlide = (
    <SlideWrapper id="slide-3" background={backgroundBlank}>
      <div className="h-full grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <ImagePlaceholder 
          className="w-full h-full hover:opacity-90 transition-opacity overflow-hidden"
          onClick={() => setImageSelector({ open: true, slideNumber: 3 })}
          slideNumber={3}
        />
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-light uppercase tracking-wide">Matchmaker's Take</h3>
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
        onOpenChange={(open) => !open && setImageSelector({ open: false, slideNumber: null })}
        onSelect={handleImageSelect}
        slideNumber={imageSelector.slideNumber ?? undefined}
      />
    </>
  );
}