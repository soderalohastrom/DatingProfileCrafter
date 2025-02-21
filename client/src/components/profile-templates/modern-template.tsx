import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Briefcase, GraduationCap, Heart, MapPin, Camera } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import { Textarea } from "@/components/ui/textarea";
import DraggableElement from "../draggable-element";

interface ModernTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Common slide wrapper component
const SlideWrapper = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <Card 
    className="w-[1920px] h-[1080px] mx-auto mb-8 slide-page overflow-hidden relative" 
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
  const [imageSelector, setImageSelector] = useState<"main" | "bio" | "matchmaker" | null>(null);
  const [matchmakerTake, setMatchmakerTake] = useState("");
  const [elementPositions, setElementPositions] = useState({
    avatar: { x: 0, y: 0 },
    name: { x: 0, y: 0 },
    location: { x: 0, y: 0 },
    career: { x: 0, y: 0 },
    education: { x: 0, y: 0 },
    interests: { x: 0, y: 0 }
  });

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto) {
      onUpdatePhoto(url);
    }
  };

  // Slide 1: Main Profile
  const MainProfileSlide = (
    <SlideWrapper id="slide-1">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-16 relative">
          <div className="flex gap-16 items-start">
            <DraggableElement
              onPositionChange={(pos) => setElementPositions(prev => ({ ...prev, avatar: pos }))}
              className="z-10"
            >
              <Avatar 
                className="w-[300px] h-[300px] border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageSelector("main")}
              >
                <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
                <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
              </Avatar>
            </DraggableElement>

            <div>
              <DraggableElement
                onPositionChange={(pos) => setElementPositions(prev => ({ ...prev, name: pos }))}
                className="z-10"
              >
                <h2 className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {profile.firstName}, {profile.age}
                </h2>
              </DraggableElement>

              <DraggableElement
                onPositionChange={(pos) => setElementPositions(prev => ({ ...prev, location: pos }))}
                className="mt-6 z-10"
              >
                <div className="flex items-center gap-3 text-muted-foreground text-2xl">
                  <MapPin className="w-8 h-8" />
                  <span>{profile.location}</span>
                </div>
              </DraggableElement>
            </div>
          </div>
        </div>

        <div className="flex-1 p-16 space-y-16">
          <div className="grid grid-cols-2 gap-16">
            <DraggableElement
              onPositionChange={(pos) => setElementPositions(prev => ({ ...prev, career: pos }))}
              className="z-10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-primary">
                  <Briefcase className="w-10 h-10" />
                  <h3 className="text-3xl font-semibold">Career</h3>
                </div>
                <p className="text-2xl">{profile.occupation}</p>
              </div>
            </DraggableElement>

            <DraggableElement
              onPositionChange={(pos) => setElementPositions(prev => ({ ...prev, education: pos }))}
              className="z-10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-primary">
                  <GraduationCap className="w-10 h-10" />
                  <h3 className="text-3xl font-semibold">Education</h3>
                </div>
                <p className="text-2xl">{profile.education}</p>
              </div>
            </DraggableElement>
          </div>

          <DraggableElement
            onPositionChange={(pos) => setElementPositions(prev => ({ ...prev, interests: pos }))}
            className="z-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary">
                <Heart className="w-10 h-10" />
                <h3 className="text-3xl font-semibold">Interests</h3>
              </div>
              <p className="text-2xl">{profile.interests}</p>
            </div>
          </DraggableElement>
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 2: Bio and Secondary Photo
  const BioSlide = (
    <SlideWrapper id="slide-2">
      <div className="h-full grid grid-cols-2">
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-semibold">About Me</h3>
          <p className="text-2xl text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          <Avatar 
            className="w-[600px] h-[600px] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setImageSelector("bio")}
          >
            <AvatarImage src={profile.photoUrl} alt="Bio photo" className="object-cover" />
            <AvatarFallback>
              <Camera className="w-24 h-24 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 3: Matchmaker's Take
  const MatchmakerSlide = (
    <SlideWrapper id="slide-3">
      <div className="h-full grid grid-cols-2">
        <div 
          className="relative cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setImageSelector("matchmaker")}
        >
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage src={profile.photoUrl} alt="Matchmaker photo" className="object-cover" />
            <AvatarFallback className="rounded-none">
              <Camera className="w-24 h-24 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
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
        open={imageSelector !== null}
        onOpenChange={(open) => !open && setImageSelector(null)}
        onSelect={handleImageSelect}
      />
    </>
  );
}