import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";

interface Position {
  x: number;
  y: number;
  scale: number;
}

interface ImageCropperProps {
  src: string;
  placeholderClassName?: string;
  aspectRatio?: number;
  position?: Position;
  onPositionChange?: (position: Position) => void;
}

export default function ImageCropper({
  src,
  placeholderClassName,
  aspectRatio = 1,
  position: initialPosition,
  onPositionChange
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialPosition?.scale ?? 1);
  const [position, setPosition] = useState({ 
    x: initialPosition?.x ?? 0, 
    y: initialPosition?.y ?? 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialGrab, setInitialGrab] = useState({ x: 0, y: 0, scale: 1 });

  // Grabber positions with improved styling
  const grabbers = [
    { id: 'tl', style: { top: -6, left: -6, cursor: 'nw-resize' } },
    { id: 'tr', style: { top: -6, right: -6, cursor: 'ne-resize' } },
    { id: 'bl', style: { bottom: -6, left: -6, cursor: 'sw-resize' } },
    { id: 'br', style: { bottom: -6, right: -6, cursor: 'se-resize' } }
  ];

  useEffect(() => {
    if (initialPosition) {
      setScale(initialPosition.scale);
      setPosition({ x: initialPosition.x, y: initialPosition.y });
    }
  }, [initialPosition]);

  useEffect(() => {
    onPositionChange?.({ ...position, scale });
  }, [position, scale, onPositionChange]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleGrabberMouseDown = (e: React.MouseEvent, grabberId: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setInitialGrab({
      x: e.clientX,
      y: e.clientY,
      scale: scale
    });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate distance from center to cursor
      const dx = moveEvent.clientX - initialGrab.x;
      const dy = moveEvent.clientY - initialGrab.y;

      // Adjust scale based on diagonal movement
      const scaleFactor = Math.sqrt(dx * dx + dy * dy) / 200;
      const directionMultiplier = dx + dy > 0 ? 1 : -1;
      const newScale = Math.max(0.5, Math.min(3, initialGrab.scale + (scaleFactor * directionMultiplier)));

      setScale(newScale);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
      {/* Semi-transparent overlay for masked areas */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-none z-10"
        style={{
          opacity: isDragging || isResizing ? 0.4 : 0.2,
          transition: 'opacity 0.2s ease'
        }}
      />

      <Draggable
        position={position}
        onDrag={handleDrag}
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
      >
        <div 
          className={cn(
            "absolute cursor-move transition-all",
            isDragging && "shadow-lg"
          )}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease'
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
        <div
          key={id}
          onMouseDown={(e) => handleGrabberMouseDown(e, id)}
          className={cn(
            "absolute w-4 h-4 bg-white rounded-full z-20 shadow-md border-2 border-primary",
            "hover:scale-110 transition-transform",
            isResizing && "scale-110 shadow-lg"
          )}
          style={{
            ...style,
            transition: 'all 0.1s ease'
          }}
        />
      ))}

      {/* Guidelines when dragging or resizing */}
      {(isDragging || isResizing) && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/30" style={{ transform: 'translateX(-50%)' }} />
          <div className="absolute top-1/2 left-0 right-0 border-t border-white/30" style={{ transform: 'translateY(-50%)' }} />
        </div>
      )}
    </div>
  );
}