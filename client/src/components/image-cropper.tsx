import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";
import { Move, Check } from "lucide-react";

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
  onClick?: () => void;
}

export default function ImageCropper({
  src,
  placeholderClassName,
  aspectRatio = 1,
  position: initialPosition,
  onPositionChange,
  onClick
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(initialPosition?.scale ?? 1);
  const [position, setPosition] = useState({ 
    x: initialPosition?.x ?? 0, 
    y: initialPosition?.y ?? 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialGrab, setInitialGrab] = useState({ x: 0, y: 0, scale: 1 });
  const [isPositionMode, setIsPositionMode] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // When image loads, calculate initial scale to fit container
  useEffect(() => {
    const image = imageRef.current;
    if (!image || !containerRef.current) return;

    const handleLoad = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imageAspect = image.naturalWidth / image.naturalHeight;
      const containerAspect = containerWidth / containerHeight;

      setImageSize({
        width: image.naturalWidth,
        height: image.naturalHeight
      });

      // Calculate scale to fit container while maintaining aspect ratio
      if (!initialPosition) {
        if (imageAspect > containerAspect) {
          setScale(containerWidth / image.naturalWidth);
        } else {
          setScale(containerHeight / image.naturalHeight);
        }
      }
    };

    image.addEventListener('load', handleLoad);
    return () => image.removeEventListener('load', handleLoad);
  }, [src]);

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
    if (!isPositionMode) return;
    setPosition({ x: data.x, y: data.y });
  };

  const handleContainerClick = () => {
    if (src) {
      setIsPositionMode(!isPositionMode);
    } else if (onClick) {
      onClick();
    }
  };

  const handleGrabberMouseDown = (e: React.MouseEvent, grabberId: string) => {
    if (!isPositionMode) return;
    e.stopPropagation();
    setIsResizing(true);
    setInitialGrab({
      x: e.clientX,
      y: e.clientY,
      scale
    });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const dx = moveEvent.clientX - initialGrab.x;
      const dy = moveEvent.clientY - initialGrab.y;

      // Scale based on diagonal movement
      const scaleFactor = Math.sqrt(dx * dx + dy * dy) / 200;
      const directionMultiplier = dx + dy > 0 ? 1 : -1;

      // Calculate min scale to fit container
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const minScale = Math.min(
        containerWidth / imageSize.width,
        containerHeight / imageSize.height
      );

      // Update scale with constraints
      const newScale = Math.max(
        minScale,
        Math.min(2, initialGrab.scale + (scaleFactor * directionMultiplier))
      );
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

  // Calculate corner positions based on scaled image size
  const getCornerStyle = (corner: string) => {
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;

    switch (corner) {
      case 'tl': return { top: 0, left: 0, cursor: 'nw-resize' };
      case 'tr': return { top: 0, left: scaledWidth - 12, cursor: 'ne-resize' };
      case 'bl': return { top: scaledHeight - 12, left: 0, cursor: 'sw-resize' };
      case 'br': return { top: scaledHeight - 12, left: scaledWidth - 12, cursor: 'se-resize' };
      default: return {};
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden group",
        placeholderClassName,
        !isPositionMode && "cursor-pointer hover:opacity-90",
        isPositionMode && "cursor-move"
      )}
      style={{ aspectRatio }}
      onClick={handleContainerClick}
    >
      {/* Semi-transparent overlay for active mode */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-none"
        style={{
          opacity: (isDragging || isResizing) ? 0.4 : isPositionMode ? 0.2 : 0,
          transition: 'opacity 0.2s ease',
          zIndex: 20
        }}
      />

      <Draggable
        position={position}
        onDrag={handleDrag}
        onStart={() => isPositionMode && setIsDragging(true)}
        onStop={() => setIsDragging(false)}
        disabled={!isPositionMode}
      >
        <div 
          className={cn(
            "absolute transition-all",
            isDragging && "shadow-lg"
          )}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease',
            zIndex: 10
          }}
        >
          <img
            ref={imageRef}
            src={src}
            alt="Crop preview"
            className="max-w-none"
            draggable={false}
          />
        </div>
      </Draggable>

      {/* Corner grabbers for resizing - only shown in position mode */}
      {isPositionMode && ['tl', 'tr', 'bl', 'br'].map((corner) => (
        <div
          key={corner}
          onMouseDown={(e) => handleGrabberMouseDown(e, corner)}
          className={cn(
            "absolute w-6 h-6 bg-white rounded-full shadow-md border-2 border-primary opacity-0 group-hover:opacity-100",
            "hover:scale-110 transition-transform",
            isResizing && "scale-110 shadow-lg opacity-100"
          )}
          style={{
            ...getCornerStyle(corner),
            transition: 'all 0.1s ease',
            zIndex: 30
          }}
        />
      ))}

      {/* Guidelines when dragging or resizing */}
      {isPositionMode && (isDragging || isResizing) && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/30" style={{ transform: 'translateX(-50%)' }} />
          <div className="absolute top-1/2 left-0 right-0 border-t border-white/30" style={{ transform: 'translateY(-50%)' }} />
        </div>
      )}
    </div>
  );
}