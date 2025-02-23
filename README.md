# Dating Profile Maker

A dynamic web application for creating and managing dating profiles with multiple template options and export capabilities.

## Current Features

### Profile Management
- Real-time profile editing with live preview
- Multiple template styles:
  - Modern: Contemporary design with gradient accents
  - Classic: Traditional elegant layout
  - Minimal: Clean, minimalist design
  - Custom: User-created templates with dynamic elements
- Profile data synchronization between form and preview
- URL parameter-based profile loading (`?profile_id={id}`)

### Template System
Each template includes a consistent 3-slide layout:
- **Slide 1: Main Profile**
  - Primary profile information
  - Key details (location, occupation, education)
  - Professional headshot with position/scale controls
- **Slide 2: Biography**
  - Extended bio text
  - Secondary profile image with position/scale controls
- **Slide 3: Matchmaker's Take**
  - Full-height profile image with position/scale controls
  - Customizable matchmaker observations

### Image Management
- Image selection and cropping system:
  - Click empty placeholder to open image selector
  - Click existing image to enter position/scale mode
  - Auto-scaling to fit container dimensions
  - Position adjustment via drag
  - Scale adjustment via corner handles
- Pre-curated image library in designated directories
- Context-aware image selection based on placement
- Standardized 16:9 aspect ratio (1920x1080px)

### Known Issues
1. Image Cropper Component:
   - Corner handles may flicker or be difficult to interact with (z-index issues)
   - Large images need better initial scaling
   - UI can become unresponsive in position mode
   - Need clearer visual feedback during interactions

### Next Steps
1. ImageCropper Improvements:
   - Fix z-index hierarchy to ensure handles are always clickable
   - Implement proper corner handle positioning relative to scaled image
   - Add visual feedback for active state and interactions
   - Optimize performance for large images
   - Consider adding a reset position button

2. Image Organization:
   - Implement categorized image selection (headshots, lifestyle, formal)
   - Add image upload capability with automatic optimization
   - Improve image preview and selection UI

3. Template System:
   - Re-enable custom template support
   - Improve template switching with proper image state preservation
   - Add template preview thumbnails

### Directory Structure
```
assets/
├── sample-images/     # Curated profile images
│   ├── headshots/    # Professional headshot photos
│   ├── lifestyle/    # Casual and activity photos
│   └── formal/       # Business formal portraits
├── backgrounds/      # Slide background images
└── logos/           # Brand and design assets
```

### Custom Template Features
- Visual template designer with drag-and-drop elements
- Support for text, image, and container elements
- Dynamic form field generation based on template elements
- Real-time preview of template changes
- Template-specific form fields:
  - Built-in templates show standard profile fields
  - Custom templates show only fields created in designer
  - Automatic text element binding between form and preview

### Export Options
- Export to multiple PNG images (one per slide)
- Export to multi-page PDF
- Maintains slide/page structure in exports

## Technology Stack
- Frontend: React/TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State Management: React Query
- Database: PostgreSQL
- Export: html2canvas + jsPDF
- Routing: wouter

## Development Guidelines

1. Template Element Management
   - Maintain template element uniqueness
   - Ensure proper cleanup when removing elements
   - Validate element names and properties

2. Form Field Synchronization
   - Match form fields to template elements exactly
   - Update form structure when template changes
   - Preserve data when switching templates

3. Code Organization
   - Keep template logic separate from form handling
   - Use consistent naming for dynamic elements
   - Document element-form relationships

4. Image Management
   - Place images in appropriate category directories
   - Maintain image quality standards per category
   - Follow naming conventions for assets

5. Future Considerations
   - Plan for template versioning
   - Consider element reusability
   - Prepare for multi-user support