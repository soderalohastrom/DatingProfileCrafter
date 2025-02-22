import { Card } from "@/components/ui/card";
import type { Theme } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ThemeListProps {
  themes: Theme[];
  selectedTheme: Theme | null;
  onSelectTheme: (theme: Theme) => void;
}

export default function ThemeList({
  themes,
  selectedTheme,
  onSelectTheme,
}: ThemeListProps) {
  return (
    <div className="space-y-4">
      {themes.map((theme) => (
        <Card
          key={theme.id}
          className={cn(
            "p-4 cursor-pointer hover:bg-accent transition-colors",
            selectedTheme?.id === theme.id && "border-primary"
          )}
          onClick={() => onSelectTheme(theme)}
        >
          <h3 className="font-semibold">{theme.name}</h3>
          <p className="text-sm text-muted-foreground">{theme.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                theme.isActive ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {theme.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
