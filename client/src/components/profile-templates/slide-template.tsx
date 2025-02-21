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
    <Card className="w-full max-w-3xl mx-auto mb-8 slide-page" id="slide-1">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar 
            className="w-32 h-32 border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setImageSelector("main")}
          >
            <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
            <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {profile.firstName}, {profile.age}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-semibold">Career</h3>
            </div>
            <p>{profile.occupation}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="w-5 h-5" />
              <h3 className="font-semibold">Education</h3>
            </div>
            <p>{profile.education}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5" />
            <h3 className="font-semibold">Interests</h3>
          </div>
          <p>{profile.interests}</p>
        </div>
      </CardContent>
    </Card>
  );

  // Slide 2: Bio and Image
  const BioSlide = (
    <Card className="w-full max-w-3xl mx-auto mb-8 slide-page" id="slide-2">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">About Me</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
          </div>
          <div className="flex items-center justify-center">
            <Avatar 
              className="w-48 h-48 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setImageSelector("bio")}
            >
              <AvatarImage src={profile.photoUrl} alt="Bio photo" />
              <AvatarFallback>
                <Camera className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Slide 3: Matchmaker's Take
  const MatchmakerSlide = (
    <Card className="w-full max-w-3xl mx-auto slide-page" id="slide-3">
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-6">Matchmaker's Take</h3>
        <div className="grid grid-cols-2 gap-8">
          <Avatar 
            className="w-full aspect-[3/4] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setImageSelector("matchmaker")}
          >
            <AvatarImage src={profile.photoUrl} alt="Matchmaker photo" className="object-cover" />
            <AvatarFallback>
              <Camera className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Textarea
              className="w-full h-full min-h-[300px] p-4"
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
      </CardContent>
    </Card>
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
