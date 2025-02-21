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
      <Card className="w-full max-w-3xl mx-auto overflow-hidden">
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

          <div>
            <h3 className="text-lg font-semibold mb-2">About Me</h3>
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-center">
              <Avatar 
                className="w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageSelector("secondary")}
              >
                <AvatarImage src={profile.photoUrl} alt="Secondary photo" />
                <AvatarFallback>
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImageSelector
        open={imageSelector !== null}
        onOpenChange={(open) => !open && setImageSelector(null)}
        onSelect={handleImageSelect}
      />
    </>
  );
}