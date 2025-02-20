import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface ClassicTemplateProps {
  profile: Partial<Profile>;
}

export default function ClassicTemplate({ profile }: ClassicTemplateProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
            <AvatarFallback>{profile.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-serif mb-1">
            {profile.firstName}, {profile.age}
          </h2>
          <p className="text-muted-foreground">{profile.location}</p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-serif mb-2">Career & Education</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Occupation</p>
                <p className="text-muted-foreground">{profile.occupation}</p>
              </div>
              <div>
                <p className="font-medium">Education</p>
                <p className="text-muted-foreground">{profile.education}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-serif mb-2">Interests</h3>
            <p className="text-muted-foreground">{profile.interests}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-serif mb-2">About Me</h3>
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
