import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
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
}

export default function ImageSelector({ 
  open, 
  onOpenChange, 
  onSelect,
  directory
}: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch images from the server, including directory parameter if provided
  const { data: images = [], error, isLoading } = useQuery<ImageData[]>({
    queryKey: ['images', directory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (directory) {
        params.append('directory', directory);
        console.log('Fetching images from directory:', directory);
      }

      const response = await fetch(`/api/upload?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      console.log('Received images:', data);
      return data;
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("image", file);
    if (directory) formData.append("directory", directory);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onSelect(data.url);
      onOpenChange(false);
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {directory?.includes('background') ? "Select Background Image" : "Select Profile Image"}
          </DialogTitle>
        </DialogHeader>

        {/* Upload Section */}
        <div className="p-4 border-b">
          <Button
            variant="outline"
            className="w-full h-24 relative"
            disabled={uploading}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8" />
              <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
            </div>
          </Button>
          {uploadError && (
            <p className="text-sm text-red-500 mt-2">{uploadError}</p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            Loading images...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-red-500">
            Error loading images: {error.message}
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
              No images found in directory: {directory}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}