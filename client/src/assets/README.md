# Assets Directory

This directory contains background images and design elements for profile templates.

## Structure

```
assets/
├── backgrounds/     # Background images for slides
│   ├── modern/     # Modern template backgrounds
│   ├── classic/    # Classic template backgrounds
│   ├── minimal/    # Minimal template backgrounds
│   └── slides/     # Slides template backgrounds
├── logos/          # Logo variations
└── borders/        # Border and decorative elements
```

## Dimensions

All slide backgrounds should follow these dimensions:
- Width: 1920 pixels
- Height: 1080 pixels
- Aspect ratio: 16:9

## Usage

Import backgrounds in template components:
```tsx
import backgroundImage from "@/assets/backgrounds/modern/slide1.png";
```

Apply as background in template:
```tsx
<div style={{ backgroundImage: `url(${backgroundImage})` }}>
  {/* Content */}
</div>
```
