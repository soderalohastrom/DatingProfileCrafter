import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Theme } from "@shared/schema";
import TemplateEditor from "@/components/admin/template-editor";
import ThemeList from "@/components/admin/theme-list";

export default function TemplateManagement() {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const { data: themes = [] } = useQuery<Theme[]>({
    queryKey: ["/api/admin/themes"],
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Template Management</h1>
        <Button
          onClick={() => setSelectedTheme(null)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Theme
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Theme List */}
        <div className="col-span-3">
          <ThemeList
            themes={themes}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        </div>

        {/* Theme Editor */}
        <div className="col-span-9">
          <TemplateEditor theme={selectedTheme} />
        </div>
      </div>
    </div>
  );
}
