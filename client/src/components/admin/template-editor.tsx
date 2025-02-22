import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Theme, InsertTheme, SlideElement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import SlideDesigner from "./slide-designer";

interface TemplateEditorProps {
  theme: Theme | null;
}

export default function TemplateEditor({ theme }: TemplateEditorProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formData, setFormData] = useState<Partial<InsertTheme>>(
    theme ?? {
      name: "",
      description: "",
      backgroundImages: {
        slide1: "",
        slide2: "",
        slide3: "",
      },
      isActive: true,
    }
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: InsertTheme) => {
      const res = await apiRequest(
        theme ? "PATCH" : "POST",
        `/api/admin/themes${theme ? `/${theme.id}` : ""}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      toast({
        title: "Success",
        description: `Theme ${theme ? "updated" : "created"} successfully`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData as InsertTheme);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Theme Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="slide1" className="w-full">
          <TabsList>
            <TabsTrigger value="slide1" onClick={() => setCurrentSlide(1)}>
              Slide 1
            </TabsTrigger>
            <TabsTrigger value="slide2" onClick={() => setCurrentSlide(2)}>
              Slide 2
            </TabsTrigger>
            <TabsTrigger value="slide3" onClick={() => setCurrentSlide(3)}>
              Slide 3
            </TabsTrigger>
          </TabsList>

          {[1, 2, 3].map((slideNum) => (
            <TabsContent key={slideNum} value={`slide${slideNum}`}>
              <SlideDesigner
                themeId={theme?.id}
                slideNumber={slideNum}
                backgroundImage={
                  formData.backgroundImages?.[`slide${slideNum}` as "slide1"]
                }
                onUpdateBackground={(url) =>
                  setFormData({
                    ...formData,
                    backgroundImages: {
                      ...formData.backgroundImages,
                      [`slide${slideNum}`]: url,
                    },
                  })
                }
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {theme ? "Update Theme" : "Create Theme"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
