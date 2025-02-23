import { Card, CardContent } from "@/components/ui/card";
import { type Profile } from "@shared/schema";
import { Briefcase, GraduationCap, Heart, Image } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import ImageCropper from "../image-cropper";
import { Textarea } from "@/components/ui/textarea";

interface ModernTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string, slideNumber: number) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Common slide wrapper component
const SlideWrapper = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <Card
    className="w-[1920px] h-[1080px] mx-auto mb-8 slide-page overflow-hidden"
    id={id}
    style={{
      aspectRatio: "16/9",
      background: "white",
    }}
  >
    <CardContent className="h-full p-0">{children}</CardContent>
  </Card>
);

export default function ModernTemplate({
  profile,
  onUpdatePhoto,
  onUpdateMatchmakerTake,
}: ModernTemplateProps) {
  const [imageSelector, setImageSelector] = useState<{
    open: boolean;
    slideNumber: number | null;
  }>({ open: false, slideNumber: null });

  const [matchmakerTake, setMatchmakerTake] = useState("");
  const [imagePositions, setImagePositions] = useState(profile.slideImagePositions || {});

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto && imageSelector.slideNumber !== null) {
      onUpdatePhoto(url, imageSelector.slideNumber);
    }
    setImageSelector({ open: false, slideNumber: null });
  };

  // Update the image placeholder component to use the new position mode
  const ImagePlaceholder = ({
    slideNumber,
    className = "",
    children,
  }: {
    slideNumber: number;
    className?: string;
    children?: React.ReactNode;
  }) => (
    <div className={className}>
      {profile[`slide${slideNumber}PhotoUrl` as keyof Profile] ? (
        <ImageCropper
          src={profile[`slide${slideNumber}PhotoUrl` as keyof Profile] as string}
          placeholderClassName="w-full h-full"
          position={imagePositions[slideNumber] || { x: 0, y: 0, scale: 1 }}
          onPositionChange={(pos) => setImagePositions((prev) => ({ ...prev, [slideNumber]: pos }))}
          onClick={() => setImageSelector({ open: true, slideNumber })}
        />
      ) : (
        <div
          className="w-full h-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground cursor-pointer"
          onClick={() => setImageSelector({ open: true, slideNumber })}
        >
          <div className="text-center">
            <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to select image</p>
          </div>
        </div>
      )}
    </div>
  );

  // Rest of the template code remains the same, but using the updated ImagePlaceholder component
  const MainProfileSlide = (
    <SlideWrapper id="slide-1">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-16">
          <div className="flex gap-16 items-start">
            <ImagePlaceholder
              slideNumber={1}
              className="w-[300px] h-[300px] rounded-full border-4 border-white shadow-lg overflow-hidden"
            />
            <div>
              <h2 className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {profile.firstName}, {profile.age}
              </h2>
              <div className="flex items-center gap-3 mt-6 text-muted-foreground text-2xl">
                <Heart className="w-8 h-8" />
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

  const BioSlide = (
    <SlideWrapper id="slide-2">
      <div className="h-full grid" style={{ gridTemplateColumns: "3fr 1fr" }}>
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-semibold">About Me</h3>
          <p className="text-2xl text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          <ImagePlaceholder slideNumber={2} className="w-[400px] h-[400px] rounded-lg overflow-hidden" />
        </div>
      </div>
    </SlideWrapper>
  );

  const MatchmakerSlide = (
    <SlideWrapper id="slide-3">
      <div className="h-full grid" style={{ gridTemplateColumns: "1fr 3fr" }}>
        <ImagePlaceholder slideNumber={3} className="w-full h-full" />
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
        onOpenChange={(open) => !open && setImageSelector({ open: false, slideNumber: null })}
        onSelect={handleImageSelect}
        slideNumber={imageSelector.slideNumber ?? undefined}
      />
    </>
  );
}