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

### Custom Template Features
- Visual template designer with drag-and-drop elements
- Support for text, image, and container elements
- Dynamic form field generation based on template elements
- Real-time preview of template changes
- Template-specific form fields:
  - Built-in templates show standard profile fields
  - Custom templates show only fields created in designer
  - Automatic text element binding between form and preview
- Synchronized field labels between designer and form:
  - Form field labels match content selection from designer
  - Consistent naming convention for database compatibility
  - Real-time updates between form input and template display

### Image Management
- Image selector modal for profile photos
- Multiple image placement options per slide
- Clickable avatar elements to trigger image selection
- Support for different image positions in templates
- Standardized 16:9 aspect ratio (1920x1080px)

### Export Options
- Export to multiple PNG images (one per slide)
- Export to multi-page PDF
- Maintains slide/page structure in exports

## Next Steps

### Background Image Integration
1. **Directory Structure**
   - Configure background image selector to read from `/backgrounds/slides`
   - Implement thumbnail display for available background images
   - Add background image preview in selector modal

2. **Image Management**
   - Support background image uploads to correct directory
   - Implement background image cropping/scaling
   - Add background overlay options for text readability

### Technical Implementation Notes

#### Profile Loading Process
1. URL Parameter Detection:
   ```typescript
   // Example URL: /profile-maker?profile_id=123456
   const params = new URLSearchParams(window.location.search);
   const profileId = params.get('profile_id');
   ```

2. Data Flow:
   - URL parameter triggers profile load
   - Form fields populate with profile data
   - Template updates in real-time
   - Changes sync between form and preview

#### Custom Template System
- Each custom template stored with unique ID
- Element positions and properties preserved
- Dynamic form generation based on template elements
- Real-time synchronization between form and preview

## Technology Stack
- Frontend: React/TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State Management: React Query
- Database: PostgreSQL (planned)
- Export: html2canvas + jsPDF
- Routing: wouter

## Development Guidelines

1. Template Element Management
   - Always maintain template element uniqueness
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

4. Testing Requirements
   - Verify form-template synchronization
   - Test element addition/removal
   - Validate data persistence

5. Future Considerations
   - Plan for template versioning
   - Consider element reusability
   - Prepare for multi-user support