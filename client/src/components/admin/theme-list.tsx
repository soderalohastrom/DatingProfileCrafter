import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Theme } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/themes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      toast({
        title: "Success",
        description: "Theme deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent, theme: Theme) => {
    e.stopPropagation(); // Prevent theme selection when clicking delete
    if (confirm(`Are you sure you want to delete theme "${theme.name}"?`)) {
      deleteMutation.mutate(theme.id);
    }
  };

  return (
    <div className="space-y-4">
      {themes.map((theme) => (
        <Card
          key={theme.id}
          className={cn(
            "p-4 cursor-pointer hover:bg-accent transition-colors group",
            selectedTheme?.id === theme.id && "border-primary"
          )}
          onClick={() => onSelectTheme(theme)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{theme.name || "Untitled Theme"}</h3>
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
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDelete(e, theme)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}