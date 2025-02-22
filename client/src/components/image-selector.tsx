import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { useState } from "react";

interface ImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

// Sample images - will be replaced with database/uploaded images later
const sampleImages = [
  "/assets/sample-images/headshots/sample1.jpg",
  "/assets/sample-images/headshots/sample2.jpg",
  "/assets/sample-images/lifestyle/sample1.jpg",
  "/assets/sample-images/formal/sample1.jpg",
];

export default function ImageSelector({ open, onOpenChange, onSelect }: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("image", file);

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
          <DialogTitle>Select Profile Image</DialogTitle>
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

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 p-4">
          {sampleImages.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary"
              onClick={() => {
                onSelect(url);
                onOpenChange(false);
              }}
            >
              <img
                src={url}
                alt={`Profile image ${index + 1}`}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}