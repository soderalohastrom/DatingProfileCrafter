import { Card, CardContent } from "@/components/ui/card";
import { type Profile } from "@shared/schema";

interface MinimalTemplateProps {
  profile: Partial<Profile>;
}

export default function MinimalTemplate({ profile }: MinimalTemplateProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-black">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-4xl font-light tracking-tight mb-1">
            {profile.firstName}
            <span className="text-muted-foreground">, {profile.age}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{profile.location}</p>
        </div>

        <div className="space-y-8 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Occupation
              </span>
              {profile.occupation}
            </p>
            <p>
              <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Education
              </span>
              {profile.education}
            </p>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Interests
            </span>
            <p>{profile.interests}</p>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
              About
            </span>
            <p>{profile.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
