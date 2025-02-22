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
  - Professional headshot
- **Slide 2: Biography**
  - Extended bio text
  - Secondary profile image
- **Slide 3: Matchmaker's Take**
  - Full-height profile image
  - Customizable matchmaker observations

### Image Management
- Categorized image selection system:
  - Headshots: Professional profile photos for main slides
  - Lifestyle: Casual and activity-based photos for bio sections
  - Formal: Business portraits for matchmaker sections
- Pre-curated image library in designated directories
- Context-aware image selection based on placement
- Image cropping and position adjustment
- Standardized 16:9 aspect ratio (1920x1080px)

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

## Upcoming Features

### MySQL Database Integration
- Profile loading via URL parameters (`?profile_id=123456`)
- Database schema aligned with profile structure
- Efficient profile data retrieval and caching
- Real-time profile updates
- Secure data handling and validation

### Technical Implementation Notes

#### Profile Loading Process
1. URL Parameter Detection:
   ```typescript
   // Example URL: /profile-maker?profile_id=123456
   const params = new URLSearchParams(window.location.search);
   const profileId = params.get('profile_id');
   ```

2. Data Flow:
   - URL parameter triggers profile load from MySQL
   - Form fields populate with profile data
   - Template updates in real-time
   - Changes sync between form and preview

## Technology Stack
- Frontend: React/TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State Management: React Query
- Database: MySQL (upcoming)
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