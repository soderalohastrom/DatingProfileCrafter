import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Camera } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";
import { Textarea } from "@/components/ui/textarea";

interface ClassicTemplateProps {
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

export default function ClassicTemplate({ 
  profile, 
  onUpdatePhoto,
  onUpdateMatchmakerTake 
}: ClassicTemplateProps) {
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
            <Avatar 
              className="w-[400px] h-[400px] mb-12 border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setImageSelector("main")}
            >
              <AvatarImage 
                src={profile.photoUrl} 
                alt={profile.firstName} 
                className="object-cover"
              />
              <AvatarFallback>
                <Camera className="w-20 h-20 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

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
    <SlideWrapper id="slide-2">
      <div className="h-full grid" style={{ gridTemplateColumns: '3fr 1fr' }}>
        <div className="p-16 space-y-8">
          <h3 className="text-5xl font-light uppercase tracking-wide mb-8">Biography</h3>
          <p className="text-2xl text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
        </div>
        <div className="flex items-center justify-center bg-black/5">
          <Avatar 
            className="w-[400px] h-[400px] cursor-pointer hover:opacity-90 transition-opacity"
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
      <div className="h-full grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
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
        open={imageSelector !== null}
        onOpenChange={(open) => !open && setImageSelector(null)}
        onSelect={handleImageSelect}
      />
    </>
  );
}