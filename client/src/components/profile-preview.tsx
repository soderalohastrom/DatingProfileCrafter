import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@shared/schema";

interface ProfilePreviewProps {
  profile: Partial<Profile>;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
            <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold">
            {profile.firstName}, {profile.age}
          </h2>
          <p className="text-muted-foreground">{profile.location}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Career & Education</h3>
            <p>{profile.occupation}</p>
            <p>{profile.education}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Interests</h3>
            <p>{profile.interests}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">About Me</h3>
            <p>{profile.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
