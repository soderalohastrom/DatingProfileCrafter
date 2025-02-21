import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface ImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

// Dummy image data - will be replaced with MySQL data later
const dummyImages = [
  "https://via.placeholder.com/150x150?text=Image+1",
  "https://via.placeholder.com/150x150?text=Image+2",
  "https://via.placeholder.com/150x150?text=Image+3",
  "https://via.placeholder.com/150x150?text=Image+4",
  "https://via.placeholder.com/150x150?text=Image+5",
  "https://via.placeholder.com/150x150?text=Image+6",
];

export default function ImageSelector({ open, onOpenChange, onSelect }: ImageSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Profile Image</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 p-4">
          {dummyImages.map((url, index) => (
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
