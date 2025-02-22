import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Image, Type, Square, Grid } from "lucide-react";
import type { SlideElement, InsertSlideElement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import DraggableElement from "../draggable-element";
import ImageSelector from "../image-selector";
import { useToast } from "@/hooks/use-toast";

interface SlideDesignerProps {
  themeId?: number;
  slideNumber: number;
  backgroundImage?: string;
  onUpdateBackground: (url: string) => void;
}

const defaultPosition = {
  x: 0,
  y: 0,
  width: 200,
  height: 100,
};

const defaultTextProperties = {
  fontSize: "16px",
  color: "#000000",
  backgroundColor: "transparent",
  padding: "0px",
  borderRadius: "0px",
};

const defaultContainerProperties = {
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  padding: "16px",
};

const defaultImageProperties = {
  objectFit: "cover",
  borderRadius: "0px",
};

export default function SlideDesigner({
  themeId,
  slideNumber,
  backgroundImage,
  onUpdateBackground,
}: SlideDesignerProps) {
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(null);
  const [imageSelector, setImageSelector] = useState<{
    open: boolean;
    type: "background" | "element" | null;
  }>({ open: false, type: null });
  const [showGrid, setShowGrid] = useState(true);
  const [newElement, setNewElement] = useState<Partial<InsertSlideElement>>({
    elementType: "text",
    position: defaultPosition,
    properties: defaultTextProperties,
    content: "New Text Element",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch slide elements
  const { data: elements = [] } = useQuery<SlideElement[]>({
    queryKey: [`/api/admin/themes/${themeId}/slides/${slideNumber}/elements`],
    enabled: !!themeId,
  });

  // Create new element
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
        queryKey: [`/api/admin/themes/${themeId}/slides/${slideNumber}/elements`],
      });
      toast({
        title: "Success",
        description: "Element added successfully",
      });
      setNewElement({
        elementType: "text",
        position: defaultPosition,
        properties: defaultTextProperties,
        content: "New Text Element",
      });
    },
  });

  // Update element position
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
        queryKey: [`/api/admin/themes/${themeId}/slides/${slideNumber}/elements`],
      });
    },
  });

  const handleAddElement = () => {
    if (!themeId) return;

    const elementData = {
      ...newElement,
      themeId,
      slideNumber,
      properties: 
        newElement.elementType === "container" 
          ? defaultContainerProperties 
          : newElement.elementType === "image"
          ? defaultImageProperties
          : defaultTextProperties,
    };

    elementMutation.mutate(elementData as InsertSlideElement);
  };

  const handlePositionChange = (
    element: SlideElement,
    newPosition: { x: number; y: number }
  ) => {
    updateElementMutation.mutate({
      id: element.id,
      data: {
        ...element,
        position: {
          ...element.position,
          ...newPosition,
        },
      },
    });
  };

  const handleImageSelect = (url: string) => {
    if (imageSelector.type === "background") {
      onUpdateBackground(url);
    } else if (imageSelector.type === "element") {
      setNewElement({
        ...newElement,
        content: url,
      });
    }
    setImageSelector({ open: false, type: null });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Background and Grid Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setImageSelector({ open: true, type: "background" })}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          {backgroundImage ? "Change Background" : "Set Background"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowGrid(!showGrid)}
          className="flex items-center gap-2"
        >
          <Grid className="w-4 h-4" />
          {showGrid ? "Hide Grid" : "Show Grid"}
        </Button>
      </div>

      {/* Slide Preview */}
      <Card
        className="w-[1920px] h-[1080px] relative bg-white"
        style={{
          transform: "scale(0.4)",
          transformOrigin: "top left",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Elements */}
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            defaultPosition={{ x: element.position.x, y: element.position.y }}
            onPositionChange={(pos) => handlePositionChange(element, pos)}
            className={`absolute ${
              selectedElement?.id === element.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div
              className="w-full h-full"
              style={{
                width: element.position.width,
                height: element.position.height,
                ...element.properties,
                border: element.elementType === "container" ? "2px dashed #e2e8f0" : undefined,
              }}
              onClick={() => setSelectedElement(element)}
            >
              {element.elementType === "image" ? (
                <img 
                  src={element.content} 
                  alt="Element" 
                  className="w-full h-full object-cover"
                  style={{ borderRadius: element.properties.borderRadius }}
                />
              ) : (
                element.content
              )}
            </div>
          </DraggableElement>
        ))}
      </Card>

      {/* Element Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add New Element</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Element Type</Label>
              <Select
                value={newElement.elementType}
                onValueChange={(value) =>
                  setNewElement({
                    ...newElement,
                    elementType: value,
                    content: value === "text" ? "New Text Element" : "",
                    properties: 
                      value === "container" 
                        ? defaultContainerProperties 
                        : value === "image"
                        ? defaultImageProperties
                        : defaultTextProperties,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span>Text</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="container">
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4" />
                      <span>Container</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      <span>Image</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newElement.elementType === "text" && (
              <div className="col-span-2">
                <Label>Content</Label>
                <Input
                  value={newElement.content}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter text content"
                />
              </div>
            )}

            {newElement.elementType === "image" && (
              <div className="col-span-2">
                <Label>Image</Label>
                <Button
                  variant="outline"
                  onClick={() => setImageSelector({ open: true, type: "element" })}
                  className="w-full"
                >
                  {newElement.content ? "Change Image" : "Select Image"}
                </Button>
              </div>
            )}

            {/* Position Controls */}
            <div className="col-span-3 grid grid-cols-4 gap-4">
              <div>
                <Label>X Position</Label>
                <Input
                  type="number"
                  value={newElement.position?.x ?? 0}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      position: {
                        ...defaultPosition,
                        ...newElement.position,
                        x: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Y Position</Label>
                <Input
                  type="number"
                  value={newElement.position?.y ?? 0}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      position: {
                        ...defaultPosition,
                        ...newElement.position,
                        y: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Width</Label>
                <Input
                  type="number"
                  value={newElement.position?.width ?? 200}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      position: {
                        ...defaultPosition,
                        ...newElement.position,
                        width: parseInt(e.target.value) || 200,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Height</Label>
                <Input
                  type="number"
                  value={newElement.position?.height ?? 100}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      position: {
                        ...defaultPosition,
                        ...newElement.position,
                        height: parseInt(e.target.value) || 100,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Properties Controls */}
            {newElement.elementType === "text" && (
              <div className="col-span-3 grid grid-cols-3 gap-4">
                <div>
                  <Label>Font Size</Label>
                  <Input
                    type="text"
                    value={newElement.properties?.fontSize}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        properties: {
                          ...defaultTextProperties,
                          ...newElement.properties,
                          fontSize: e.target.value,
                        },
                      })
                    }
                    placeholder="16px"
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={newElement.properties?.color}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        properties: {
                          ...defaultTextProperties,
                          ...newElement.properties,
                          color: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Background</Label>
                  <Input
                    type="color"
                    value={newElement.properties?.backgroundColor === "transparent"
                      ? "#ffffff"
                      : newElement.properties?.backgroundColor}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        properties: {
                          ...defaultTextProperties,
                          ...newElement.properties,
                          backgroundColor: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {(newElement.elementType === "container" || newElement.elementType === "image") && (
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {newElement.elementType === "container" && (
                  <div>
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={newElement.properties?.backgroundColor ?? "#f1f5f9"}
                      onChange={(e) =>
                        setNewElement({
                          ...newElement,
                          properties: {
                            ...defaultContainerProperties,
                            ...newElement.properties,
                            backgroundColor: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <Label>Border Radius</Label>
                  <Input
                    type="text"
                    value={newElement.properties?.borderRadius ?? "8px"}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        properties: {
                          ...(newElement.elementType === "container" ? defaultContainerProperties : defaultImageProperties),
                          ...newElement.properties,
                          borderRadius: e.target.value,
                        },
                      })
                    }
                    placeholder="8px"
                  />
                </div>
                {newElement.elementType === "container" && (
                  <div>
                    <Label>Padding</Label>
                    <Input
                      type="text"
                      value={newElement.properties?.padding ?? "16px"}
                      onChange={(e) =>
                        setNewElement({
                          ...newElement,
                          properties: {
                            ...defaultContainerProperties,
                            ...newElement.properties,
                            padding: e.target.value,
                          },
                        })
                      }
                      placeholder="16px"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <Button 
            onClick={handleAddElement} 
            className="w-full"
            disabled={elementMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Element
          </Button>
        </div>
      </Card>

      <ImageSelector
        open={imageSelector.open}
        onOpenChange={(open) => setImageSelector({ open, type: imageSelector.type })}
        onSelect={handleImageSelect}
        directory={imageSelector.type === "background" ? "/backgrounds" : undefined}
      />
    </div>
  );
}