import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Image } from "lucide-react";
import type { SlideElement, InsertSlideElement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import DraggableElement from "../draggable-element";
import ImageSelector from "../image-selector";

interface SlideDesignerProps {
  themeId?: number;
  slideNumber: number;
  backgroundImage?: string;
  onUpdateBackground: (url: string) => void;
}

export default function SlideDesigner({
  themeId,
  slideNumber,
  backgroundImage,
  onUpdateBackground,
}: SlideDesignerProps) {
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(null);
  const [imageSelector, setImageSelector] = useState(false);
  const [newElement, setNewElement] = useState<Partial<InsertSlideElement>>({
    elementType: "text",
    position: { x: 0, y: 0, width: 200, height: 100 },
    properties: {
      fontSize: "16px",
      color: "#000000",
      backgroundColor: "transparent",
    },
  });

  const queryClient = useQueryClient();

  const { data: elements = [] } = useQuery<SlideElement[]>({
    queryKey: ["/api/admin/slide-elements", themeId, slideNumber],
    enabled: !!themeId,
  });

  const elementMutation = useMutation({
    mutationFn: async (data: InsertSlideElement) => {
      const res = await apiRequest(
        "POST",
        `/api/admin/themes/${themeId}/slides/${slideNumber}/elements`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/slide-elements", themeId, slideNumber],
      });
    },
  });

  const updateElementMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertSlideElement>;
    }) => {
      const res = await apiRequest(
        "PATCH",
        `/api/admin/themes/${themeId}/slides/${slideNumber}/elements/${id}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/slide-elements", themeId, slideNumber],
      });
    },
  });

  const handleAddElement = () => {
    if (!themeId) return;

    elementMutation.mutate({
      ...newElement,
      themeId,
      slideNumber,
    } as InsertSlideElement);
  };

  const handlePositionChange = (
    element: SlideElement,
    position: { x: number; y: number }
  ) => {
    updateElementMutation.mutate({
      id: element.id,
      data: {
        ...element,
        position: {
          ...element.position,
          x: position.x,
          y: position.y,
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Background Image Selection */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => setImageSelector(true)}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          {backgroundImage ? "Change Background" : "Set Background"}
        </Button>
      </div>

      {/* Slide Preview */}
      <Card
        className="w-[1920px] h-[1080px] relative"
        style={{
          transform: "scale(0.4)",
          transformOrigin: "top left",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            defaultPosition={{ x: element.position.x, y: element.position.y }}
            onPositionChange={(pos) => handlePositionChange(element, pos)}
            className={`absolute`}
            style={{
              width: element.position.width,
              height: element.position.height,
              ...element.properties,
            }}
          >
            <div
              className="w-full h-full"
              onClick={() => setSelectedElement(element)}
            >
              {element.content}
            </div>
          </DraggableElement>
        ))}
      </Card>

      {/* Element Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add New Element</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Element Type</Label>
              <Select
                value={newElement.elementType}
                onValueChange={(value) =>
                  setNewElement({ ...newElement, elementType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Position X</Label>
              <Input
                type="number"
                value={newElement.position?.x}
                onChange={(e) =>
                  setNewElement({
                    ...newElement,
                    position: {
                      ...newElement.position,
                      x: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Position Y</Label>
              <Input
                type="number"
                value={newElement.position?.y}
                onChange={(e) =>
                  setNewElement({
                    ...newElement,
                    position: {
                      ...newElement.position,
                      y: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Width</Label>
              <Input
                type="number"
                value={newElement.position?.width}
                onChange={(e) =>
                  setNewElement({
                    ...newElement,
                    position: {
                      ...newElement.position,
                      width: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                type="number"
                value={newElement.position?.height}
                onChange={(e) =>
                  setNewElement({
                    ...newElement,
                    position: {
                      ...newElement.position,
                      height: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
          <Button onClick={handleAddElement} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Element
          </Button>
        </div>
      </Card>

      <ImageSelector
        open={imageSelector}
        onOpenChange={setImageSelector}
        onSelect={(url) => {
          onUpdateBackground(url);
          setImageSelector(false);
        }}
      />
    </div>
  );
}
