import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Briefcase, GraduationCap, Heart, MapPin, Camera } from "lucide-react";
import { useState } from "react";
import ImageSelector from "../image-selector";

interface ModernTemplateProps {
  profile: Partial<Profile>;
  onUpdatePhoto?: (url: string) => void;
}

export default function ModernTemplate({ profile, onUpdatePhoto }: ModernTemplateProps) {
  const [imageSelector, setImageSelector] = useState<"main" | "secondary" | null>(null);

  const handleImageSelect = (url: string) => {
    if (onUpdatePhoto) {
      onUpdatePhoto(url);
    }
  };

  return (
    <>
      <Card 
        className="w-[1920px] h-[1080px] mx-auto overflow-hidden"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-16">
            <div className="flex gap-16 items-start">
              <Avatar 
                className="w-[300px] h-[300px] border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageSelector("main")}
              >
                <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
                <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
              </Avatar>
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

          {/* Content Section */}
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

            <div className="space-y-4">
              <h3 className="text-3xl font-semibold">About Me</h3>
              <p className="text-2xl text-muted-foreground">{profile.bio}</p>
            </div>
          </div>
        </div>
      </Card>

      <ImageSelector
        open={imageSelector !== null}
        onOpenChange={(open) => !open && setImageSelector(null)}
        onSelect={handleImageSelect}
      />
    </>
  );
}