import { Card, CardContent } from "@/components/ui/card";
import { type Profile } from "@shared/schema";

interface MinimalTemplateProps {
  profile: Partial<Profile>;
}

export default function MinimalTemplate({ profile }: MinimalTemplateProps) {
  return (
    <Card 
      className="w-[1920px] h-[1080px] mx-auto bg-white"
      style={{ aspectRatio: '16/9' }}
    >
      <CardContent className="h-full p-24">
        <div className="mb-16">
          <h2 className="text-8xl font-light tracking-tight mb-4">
            {profile.firstName}
            <span className="text-muted-foreground">, {profile.age}</span>
          </h2>
          <p className="text-2xl text-muted-foreground">{profile.location}</p>
        </div>

        <div className="space-y-16 text-xl">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-3">
                Occupation
              </span>
              <p className="text-3xl">{profile.occupation}</p>
            </div>
            <div>
              <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-3">
                Education
              </span>
              <p className="text-3xl">{profile.education}</p>
            </div>
          </div>

          <div>
            <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-3">
              Interests
            </span>
            <p className="text-3xl">{profile.interests}</p>
          </div>

          <div>
            <span className="block text-lg uppercase tracking-wide text-muted-foreground mb-3">
              About
            </span>
            <p className="text-3xl">{profile.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}