import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";

interface ClassicTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
}

// SVG Border Component
const BorderDecoration = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1200 1600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="20"
      y="20"
      width="1160"
      height="1560"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.2"
      rx="4"
    />
  </svg>
);

// Logo Component
const MatchmakingLogo = () => (
  <div className="flex items-center justify-center mb-6">
    <div className="bg-black text-white px-4 py-2 rounded">
      <div className="text-2xl font-bold tracking-wide">K KELLEHER.</div>
      <div className="text-xs text-center tracking-widest">MATCHMAKING</div>
    </div>
  </div>
);

export default function ClassicTemplate({ profile, onUpdatePhoto }: ClassicTemplateProps) {
  return (
    <Card className="w-full max-w-[1200px] mx-auto relative bg-white min-h-[1600px]">
      <BorderDecoration />
      <CardContent className="p-12 relative">
        <MatchmakingLogo />

        <div className="flex flex-col items-center mb-12">
          <Avatar 
            className="w-48 h-48 mb-8 border-4 border-white shadow-lg"
            onClick={() => onUpdatePhoto?.("https://via.placeholder.com/400x400")}
          >
            <AvatarImage 
              src={profile.photoUrl} 
              alt={profile.firstName} 
              className="object-cover"
            />
            <AvatarFallback>
              <Camera className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h1 className="text-5xl font-light tracking-wide mb-4">
              {profile.firstName || "Name"}
            </h1>
            <h2 className="text-xl font-light tracking-widest text-muted-foreground uppercase mb-2">
              {profile.location || "Location"}
            </h2>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-12 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Education</h3>
              <p className="text-lg">{profile.education || "Education details"}</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Profession</h3>
              <p className="text-lg">{profile.occupation || "Professional details"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Raised</h3>
            <p className="text-lg">{profile.location || "Location details"}</p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Height</h3>
            <p className="text-lg">{profile.bio ? profile.bio.split('\n')[0] : "Height details"}</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground uppercase tracking-widest">
          CHAIRMAN GROUP · www.kelleher-international.com
        </div>
      </CardContent>
    </Card>
  );
}