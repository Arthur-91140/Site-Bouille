# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "Les P'tites Bouilles Villebonnaises", an association for early childhood activities in Villebon-sur-Yvette, France. The site showcases activities, photo galleries, membership information, and contact details for parents and childcare professionals.

Website: https://www.lesptitesbouillesvillebonnaises.fr/

## Development Commands

This is a static HTML/CSS/JavaScript website with no build process. Development is straightforward:

**Local Development:**
- Open `index.html` directly in a browser, or
- Use any local HTTP server (e.g., `python -m http.server 8000` or Live Server extension)

**Testing:**
- No automated test suite - manual testing in browser required
- Test responsive design at breakpoints for mobile, tablet, and desktop
- Verify all pages load correctly from the navigation menu

## Architecture

### Site Structure

```
/
├── index.html              # Home page with carousel, presentation
├── pages/                  # All subpages
│   ├── activites.html      # Activities and membership
│   ├── gallery.html        # Photo galleries organized by album
│   ├── disponibilite.html  # Childminder availability
│   ├── agenda.html         # Activity planning/calendar
│   ├── contact.html        # Contact form
│   ├── mention-legale.html # Legal information
│   └── login-page.html     # Admin login (unused/legacy)
├── styles/                 # CSS files
│   ├── styles.css          # Global styles (header, footer, base)
│   ├── accueil.css         # Home page specific styles
│   ├── activites.css       # Activities page styles
│   ├── gallery.css         # Gallery page styles
│   ├── agenda.css          # Calendar/planning styles
│   ├── contact.css         # Contact form styles
│   ├── disponibilite.css   # Availability page styles
│   ├── mention-legale.css  # Legal page styles
│   └── responsive.css      # Currently empty
├── script/                 # JavaScript files
│   ├── accueil.js          # Carousel, animations for home
│   ├── activites.js        # Activity page interactions
│   ├── gallery.js          # Gallery album data and lightbox
│   ├── agenda.js           # Calendar functionality
│   ├── contact.js          # Contact form validation
│   ├── process_adhesion.php  # Backend for membership form
│   └── process_contact.php   # Backend for contact form
└── assets/                 # Images and media
    ├── photos-*/           # Photo album directories
    └── *.jpg, *.png, *.webp # Images for carousel, posters, logos
```

### Design Pattern

**Page-Specific Architecture:**
- Each page has dedicated HTML, CSS, and JS files with matching names
- Global styles in `styles/styles.css` define header, footer, navigation, and base typography
- Page-specific CSS files extend global styles with unique layouts and components
- JavaScript files are self-contained and handle page-specific functionality

**Common Elements:**
- Header: Sticky navigation with gradient logo "Les p'tites bouilles villebonnaises"
- Footer: About section, contact info, social links (Facebook, Instagram)
- Navigation: 6 main pages accessible from all pages

### Key Components

**Home Page (index.html):**
- Automated carousel with 3 slides (5s interval, swipe support, keyboard navigation)
- Presentation section with association description
- Two main cards linking to activities and membership

**Gallery (gallery.html + gallery.js):**
- Album-based photo organization using `albumsData` object
- Each album has title, date, icon, and photos generated via `generatePhotos()` function
- Photos stored in `assets/photos-{album-name}/` directories
- Naming convention: `assets/photos-{album-name}/{album-name}-{number}.{ext}`
- Lightbox functionality for viewing full-size images

**Activities Page (activites.html):**
- Featured activity posters (yoga, meditation animale, etc.)
- Detailed activity descriptions with icons
- Membership information and registration form

**Agenda (agenda.js):**
- Activity scheduling and calendar display
- Planning information for parents and professionals

**Forms:**
- PHP backend files in `script/` directory
- Client-side validation in JavaScript files
- CORS headers configured in PHP files

### Styling Approach

**Color Scheme:**
- Primary gradient: `#ff4d79` → `#ff6b6b` → `#ff9d6c` (pink-orange gradient)
- Background: `#f9f9f9` (light gray)
- Text: `#333` (dark gray)
- Font: 'Poppins', Arial, sans-serif

**Navigation Styling:**
- Active page indicated with gradient underline
- Hover effects with gradient underline animation
- Sticky header with backdrop blur

**Animations:**
- Intersection Observer for scroll-triggered animations
- CSS transitions with cubic-bezier easing
- Ripple effects on card clicks
- Carousel slide transitions

## Important Conventions

### File Paths
- HTML pages in `pages/` use relative paths with `../` for assets/styles/scripts
- Root `index.html` uses `./` for relative paths
- Asset paths must account for directory depth

### Image Naming
- Gallery photos follow pattern: `{album-name}-{number}.{ext}`
- Albums defined in `gallery.js` `albumsData` object
- `generatePhotos()` function creates photo arrays automatically

### Navigation Links
- Active page gets `class="active"` on nav link
- All pages should have complete navigation menu
- Logo links should point to appropriate relative path

### Responsive Design
- `responsive.css` exists but is currently empty
- Responsive styles should be added as media queries
- Mobile-first approach recommended

## PHP Backend

Two PHP scripts handle form submissions:
- `process_adhesion.php`: Membership/adhesion form
- `process_contact.php`: Contact form

Both include:
- CORS headers for cross-origin requests
- POST method validation
- Input sanitization with `trim()`
- Email validation
- Required field checking

## Sitemap

`sitemap.xml` includes all public pages with priorities and update frequencies. Update when adding new pages.
