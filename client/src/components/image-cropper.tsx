import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";

interface ImageCropperProps {
  src: string;
  placeholderClassName?: string;
  aspectRatio?: number;
  onPositionChange?: (position: { x: number; y: number, scale: number }) => void;
}

export default function ImageCropper({
  src,
  placeholderClassName,
  aspectRatio = 1,
  onPositionChange
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Corner grabber positions
  const grabbers = [
    { id: 'tl', style: { top: 0, left: 0, cursor: 'nw-resize' } },
    { id: 'tr', style: { top: 0, right: 0, cursor: 'ne-resize' } },
    { id: 'bl', style: { bottom: 0, left: 0, cursor: 'sw-resize' } },
    { id: 'br', style: { bottom: 0, right: 0, cursor: 'se-resize' } }
  ];

  useEffect(() => {
    onPositionChange?.({ ...position, scale });
  }, [position, scale]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleGrabberDrag = (e: any, data: { x: number; y: number }, grabberId: string) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate new scale based on grabber movement
    const dx = data.x - centerX;
    const dy = data.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const newScale = Math.max(0.1, Math.min(2, distance / (rect.width / 2)));
    
    setScale(newScale);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        placeholderClassName
      )}
      style={{ aspectRatio }}
    >
      <Draggable
        position={position}
        onDrag={handleDrag}
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
      >
        <div 
          className={cn(
            "absolute cursor-move transition-shadow",
            isDragging && "shadow-lg"
          )}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center'
          }}
        >
          <img
            src={src}
            alt="Crop preview"
            className="max-w-none"
            draggable={false}
          />
        </div>
      </Draggable>

      {/* Corner grabbers for resizing */}
      {grabbers.map(({ id, style }) => (
        <Draggable
          key={id}
          onDrag={(e, data) => handleGrabberDrag(e, data, id)}
        >
          <div
            className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-10"
            style={style}
          />
        </Draggable>
      ))}
    </div>
  );
}
