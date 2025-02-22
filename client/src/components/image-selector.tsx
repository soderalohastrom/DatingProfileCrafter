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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  context?: 'headshot' | 'lifestyle' | 'formal' | 'background';
}

export default function ImageSelector({ 
  open, 
  onOpenChange, 
  onSelect,
  directory,
  context = 'headshot'
}: ImageSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'headshot' | 'lifestyle' | 'formal'>(
    context === 'background' ? 'headshot' : context as 'headshot' | 'lifestyle' | 'formal'
  );

  // Format directory path for API based on context
  const getDirectoryPath = () => {
    if (directory) return directory;
    return `assets/sample-images/${selectedCategory}`;
  };

  // Fetch images from the server
  const { data: images = [], error, isLoading } = useQuery<ImageData[]>({
    queryKey: ['images', getDirectoryPath()],
    queryFn: async () => {
      const params = new URLSearchParams();
      const dirPath = getDirectoryPath();
      params.append('directory', dirPath);
      console.log('Fetching images from directory:', dirPath);

      const response = await fetch(`/api/upload?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      console.log('Received images:', data);
      return data;
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {directory?.includes('backgrounds') ? "Select Background Image" : "Select Profile Image"}
          </DialogTitle>
        </DialogHeader>

        {/* Category Selector - Only show for profile images */}
        {!directory && (
          <div className="p-4 border-b">
            <Select
              value={selectedCategory}
              onValueChange={(value: 'headshot' | 'lifestyle' | 'formal') => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select image category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headshot">Professional Headshots</SelectItem>
                <SelectItem value="lifestyle">Lifestyle Photos</SelectItem>
                <SelectItem value="formal">Formal Portraits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

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
              No images found in category: {selectedCategory}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}