import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Briefcase, GraduationCap, Heart, MapPin, Camera } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import { Textarea } from "@/components/ui/textarea";

interface SlideTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Common slide wrapper component with standardized dimensions
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

export default function SlideTemplate({ 
  profile, 
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: SlideTemplateProps) {
  const [imageSelector, setImageSelector] = useState<"main" | "bio" | "matchmaker" | null>(null);
  const [matchmakerTake, setMatchmakerTake] = useState("");

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto) {
      onUpdatePhoto(url);
    }
  };

  // Slide 1: Main Profile
  const MainProfileSlide = (
    <SlideWrapper id="slide-1">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-12">
          <div className="flex gap-12 items-start">
            <Avatar 
              className="w-48 h-48 border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setImageSelector("main")}
            >
              <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
              <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {profile.firstName}, {profile.age}
              </h2>
              <div className="flex items-center gap-2 mt-4 text-muted-foreground text-xl">
                <MapPin className="w-6 h-6" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-12 space-y-12">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Briefcase className="w-8 h-8" />
                <h3 className="text-2xl font-semibold">Career</h3>
              </div>
              <p className="text-xl">{profile.occupation}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <GraduationCap className="w-8 h-8" />
                <h3 className="text-2xl font-semibold">Education</h3>
              </div>
              <p className="text-xl">{profile.education}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Heart className="w-8 h-8" />
              <h3 className="text-2xl font-semibold">Interests</h3>
            </div>
            <p className="text-xl">{profile.interests}</p>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 2: Bio and Image
  const BioSlide = (
    <SlideWrapper id="slide-2">
      <div className="h-full grid grid-cols-2">
        <div className="p-12 space-y-6">
          <h3 className="text-4xl font-semibold">About Me</h3>
          <p className="text-xl text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
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
        <div className="p-12 space-y-6">
          <h3 className="text-4xl font-semibold">Matchmaker's Take</h3>
          <Textarea
            className="w-full h-[800px] text-xl p-6"
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