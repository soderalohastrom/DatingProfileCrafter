import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";

interface ClassicTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
}

export default function ClassicTemplate({ profile, onUpdatePhoto }: ClassicTemplateProps) {
  return (
    <Card 
      className="w-[1920px] h-[1080px] mx-auto relative bg-white overflow-hidden"
      style={{ aspectRatio: '16/9' }}
    >
      <CardContent className="h-full p-16 relative">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-black text-white px-6 py-3 rounded">
            <div className="text-3xl font-bold tracking-wide">K KELLEHER.</div>
            <div className="text-sm text-center tracking-widest">MATCHMAKING</div>
          </div>
        </div>

        <div className="flex gap-16">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-center">
            <Avatar 
              className="w-[400px] h-[400px] mb-8 border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onUpdatePhoto?.("https://via.placeholder.com/400x400")}
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

            <div className="text-center mb-8">
              <h1 className="text-7xl font-light tracking-wide mb-4">
                {profile.firstName || "Name"}
              </h1>
              <h2 className="text-2xl font-light tracking-widest text-muted-foreground uppercase">
                {profile.location || "Location"}
              </h2>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-12 pt-[400px]">
            <div>
              <h3 className="text-xl uppercase tracking-wider text-muted-foreground mb-3">Education</h3>
              <p className="text-2xl">{profile.education || "Education details"}</p>
            </div>

            <div>
              <h3 className="text-xl uppercase tracking-wider text-muted-foreground mb-3">Profession</h3>
              <p className="text-2xl">{profile.occupation || "Professional details"}</p>
            </div>

            <div>
              <h3 className="text-xl uppercase tracking-wider text-muted-foreground mb-3">Interests</h3>
              <p className="text-2xl">{profile.interests || "Interest details"}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground uppercase tracking-widest">
          CHAIRMAN GROUP · www.kelleher-international.com
        </div>
      </CardContent>
    </Card>
  );
}