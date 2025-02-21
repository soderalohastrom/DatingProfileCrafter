# Dating Profile Maker

A dynamic web application for creating and managing dating profiles with multiple template options and export capabilities.

## Current Features

### Profile Management
- Real-time profile editing with live preview
- Multiple template styles:
  - Modern: Contemporary design with gradient accents
  - Classic: Traditional elegant layout
  - Minimal: Clean, minimalist design
- Profile data synchronization between form and preview
- URL parameter-based profile loading (`?profile_id={id}`)

### Templates
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
- Image selector modal for profile photos
- Multiple image placement options per slide
- Clickable avatar elements to trigger image selection
- Support for different image positions in templates
- Standardized 16:9 aspect ratio (1920x1080px)

### Export Options
- Export to multiple PNG images (one per slide)
- Export to multi-page PDF
- Maintains slide/page structure in exports

## Planned Features

### Database Integration
- MySQL database integration planned
- Profile data will be stored in database tables
- URL parameter (`?profile_id={6digit#}`) will:
  1. Load profile data from database
  2. Auto-populate form fields
  3. Create new database entry if profile_id doesn't exist
  4. Support profile updates via "Save Profile"

### Extended Image Support
- Image storage in MySQL database
- Thumbnail generation and management
- Multiple image support per profile
- Image categorization and ordering

## Technical Implementation

### Profile Loading Process
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

### Template System
- Each template is a separate component
- Unified interface for all templates
- Consistent 3-slide structure
- Common image selection system
- Standardized 16:9 aspect ratio

### Export System
- Uses html2canvas for PNG generation
- jsPDF for PDF creation
- Handles multi-page documents
- Maintains aspect ratios and quality

## Future Development Notes

### Database Schema (Planned)
```sql
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  location TEXT NOT NULL,
  occupation TEXT NOT NULL,
  education TEXT NOT NULL,
  interests TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Integration Points
1. Profile Loading:
   - API endpoint for profile retrieval
   - Automatic form population
   - Template synchronization

2. Image Management:
   - Image upload and storage
   - Thumbnail generation
   - Gallery management

3. Profile Updates:
   - Real-time saves
   - Version tracking
   - Change history

## Technology Stack

- Frontend: React/TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State Management: React Query
- Database: PostgreSQL (planned)
- Export: html2canvas + jsPDF
- Routing: wouter

## Development Guidelines

1. Always maintain real-time sync between form and preview
2. Support multiple template styles
3. Ensure proper error handling for profile loading
4. Maintain clean separation between UI components
5. Follow TypeScript best practices
6. Use proper form validation
7. Implement responsive design