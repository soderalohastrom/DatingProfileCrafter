import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface ImageData {
  url: string;
  thumbnailUrl: string;
  type: 'profile' | 'background';
}

interface ImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  directory?: string;
  slideNumber?: number;
}

export default function ImageSelector({ 
  open, 
  onOpenChange, 
  onSelect,
  directory,
  slideNumber
}: ImageSelectorProps) {
  // Format directory path for API based on context
  const getDirectoryPath = () => {
    if (directory) return directory;
    return `assets/sample-images/profile`;
  };

  // Fetch images from the server
  const { data: images = [], error, isLoading } = useQuery<ImageData[]>({
    queryKey: ['images', getDirectoryPath()],
    queryFn: async () => {
      const params = new URLSearchParams();
      const dirPath = getDirectoryPath();
      params.append('directory', dirPath);

      const response = await fetch(`/api/upload?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      return await response.json();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {directory?.includes('backgrounds') 
              ? "Select Background Image" 
              : `Select Image for Slide ${slideNumber}`}
          </DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            Loading images...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-red-500">
            Error loading images: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 max-h-[400px] overflow-y-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary"
              onClick={() => {
                onSelect(image.url);
                onOpenChange(false);
              }}
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  Select
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && !error && images.length === 0 && (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              No images found in directory
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}