import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Camera } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import { Textarea } from "@/components/ui/textarea";

interface MinimalTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
  onUpdateMatchmakerTake?: (text: string) => void;
}

// Common slide wrapper component
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

export default function MinimalTemplate({ 
  profile,
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: MinimalTemplateProps) {
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
      <div className="h-full p-24 flex">
        <div className="flex-1 pr-24">
          <div className="mb-24">
            <h2 className="text-8xl font-light tracking-tight mb-6">
              {profile.firstName}
              <span className="text-muted-foreground">, {profile.age}</span>
            </h2>
            <p className="text-2xl text-muted-foreground">{profile.location}</p>
          </div>

          <div className="space-y-20 text-xl">
            <div className="grid grid-cols-2 gap-20">
              <div>
                <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-4">
                  Occupation
                </span>
                <p className="text-4xl">{profile.occupation}</p>
              </div>
              <div>
                <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-4">
                  Education
                </span>
                <p className="text-4xl">{profile.education}</p>
              </div>
            </div>

            <div>
              <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-4">
                Interests
              </span>
              <p className="text-4xl">{profile.interests}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Avatar 
            className="w-[500px] h-[500px] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setImageSelector("main")}
          >
            <AvatarImage src={profile.photoUrl} alt={profile.firstName} className="object-cover" />
            <AvatarFallback>
              <Camera className="w-24 h-24 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </SlideWrapper>
  );

  // Slide 2: Bio and Secondary Photo
  const BioSlide = (
    <SlideWrapper id="slide-2">
      <div className="h-full grid grid-cols-2">
        <div className="p-24 space-y-12">
          <span className="block text-lg uppercase tracking-wide text-muted-foreground">
            About
          </span>
          <p className="text-4xl leading-relaxed">{profile.bio}</p>
        </div>
        <div className="flex items-center justify-center bg-black/[0.02]">
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
        <div className="p-24 space-y-12">
          <span className="block text-lg uppercase tracking-wide text-muted-foreground">
            Matchmaker's Take
          </span>
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