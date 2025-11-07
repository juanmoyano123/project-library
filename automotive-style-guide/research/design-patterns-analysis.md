# GKC Automotive Sector - Design Patterns Analysis

## Research Date
November 6, 2025

## Site Analyzed
https://gkc.ca/en/project-sectors/categories/automotive

---

## 1. VISUAL DESIGN PATTERNS

### 1.1 Color Strategy
- **Primary Dark**: `#151f26` - Deep navy/charcoal used for primary text and headers
- **Pure White**: `#ffffff` - Clean backgrounds, emphasizing clarity and precision
- **Gray Accent**: `#a2a2a2` - Secondary text, borders, subtle UI elements
- **Minimal color palette**: Creates a sophisticated, professional, industrial aesthetic
- **High contrast**: 4.5:1+ ratios ensure readability and accessibility

**Automotive Industry Insight**: The restrained color palette reflects precision engineering, professionalism, and technical excellence characteristic of automotive design.

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Font Families
- **ABCDiatype**: Primary font for headings and body text
  - Regular (400) for body content
  - Bold (700) for emphasis and headings
  - Italic variants for special cases
- **SuisseIntlCond**: Condensed font for labels and metadata
  - Used for uppercase labels
  - Creates visual hierarchy through weight contrast

### 2.2 Type Scale (Observed)
```
H1: 83.3333px / 400 weight / -3.33333px letter-spacing
H2: 24px / 700 weight / 26.4px line-height
H3: 18.72px / 700 weight / 20.592px line-height
Body (Large): 30px / 400 weight / -0.6px letter-spacing
Body (Default): 18px / 400 weight / 22.14px line-height
Labels: 14px / 400 weight / UPPERCASE / 0.14px letter-spacing
```

**Automotive Industry Insight**: Large, bold typography with tight letter-spacing creates impact and reflects the bold, confident nature of automotive design.

---

## 3. LAYOUT PATTERNS

### 3.1 Grid System
- **Container-based layout**: Centered content with max-width constraints
- **Asymmetric grid**: 2/3 - 1/3 splits for content/sidebar layouts
- **Gutters with dividers**: Visual separation using 1px borders
- **Full-width hero sections**: Bold, impactful entry points

### 3.2 Spacing System
- Consistent use of white space for breathing room
- Border-based section dividers (`-border-bottom` utility class)
- Vertical rhythm maintained through consistent padding/margin

### 3.3 Component Layouts Observed
- **Hero Section** (`c-hero-gamma`):
  - Large title (H1)
  - Descriptive text
  - Grid-based footer with metadata

- **Aside Layout** (`c-aside-layout`):
  - Sidebar navigation (filters/categories)
  - Main content area for project listings

- **Project Cards** (implied from structure):
  - Image-first approach
  - Minimal text overlay
  - Category tags/labels

---

## 4. NAVIGATION PATTERNS

### 4.1 Header Navigation
- **Fixed header**: Sticky navigation for constant access
- **Logo placement**: Top-left (standard web convention)
- **Hamburger menu**: Mobile-first approach with full-screen menu overlay
- **Language switcher**: Bilingual support (EN/FR)

### 4.2 Menu Behavior
- **Full-screen overlay menu**: Immersive navigation experience
- **Animated transitions**: Smooth menu open/close with `data-swup-animation`
- **Primary navigation links**: Large, clear, with hover effects
- **Call-to-action**: "Contact Us" button prominently displayed in menu

### 4.3 Sidebar Filter Navigation
- **Vertical list**: Category filters in left sidebar
- **Active state indicators**: Visual feedback for current page
- **"All projects" option**: Easy way to reset filters

---

## 5. INTERACTION PATTERNS

### 5.1 Animations
- **Preloader**: Custom spinner animation with geometric elements
- **Menu transitions**: `transition-menu` class for smooth page changes
- **Scroll-based animations**: `u-anim-title`, `u-anim-translate-y` for progressive reveals
- **Hover states**: Underline effects on links (`u-hover-underline`)

### 5.2 Loading States
- Custom preloader with geometric spinner
- Cubic-bezier easing: `cubic-bezier(0.38, 0.005, 0.215, 1)`
- Transform-based animations for performance

---

## 6. COMPONENT PATTERNS

### 6.1 Buttons
- **Two main variants**: Background buttons (`-background`) and outline variants
- **Size modifiers**: `-big`, `-auto` for different contexts
- **Label wrapper pattern**: Nested spans for animation effects
- **Screen reader support**: Hidden text for accessibility

### 6.2 Cards (Project Listings)
Based on the structure, project cards likely include:
- Large featured images
- Project titles
- Category tags
- Hover effects for interactivity

### 6.3 Icons
- SVG sprite system for icons
- Logo split into two parts for animation possibilities
- ARIA attributes for accessibility

---

## 7. AUTOMOTIVE INDUSTRY CHARACTERISTICS

### 7.1 Visual Language
- **Precision**: Clean lines, geometric shapes, exact spacing
- **Bold imagery**: Large, high-quality project photos
- **Technical aesthetic**: Grid-based layouts, monochromatic palette
- **Performance**: Fast loading, optimized animations

### 7.2 Content Strategy
- **Project-focused**: Visual portfolio approach
- **Categorization**: Clear sector/category filtering
- **Minimal text**: Let projects speak for themselves
- **Professional tone**: Serious, capability-focused

### 7.3 Unique Differentiators
- Custom geometric preloader (reflects architectural/engineering precision)
- Sophisticated typography with negative letter-spacing
- Asymmetric grid layouts (breaks from standard templates)
- Monochromatic palette with accent red (likely for CTAs or alerts)

---

## 8. RESPONSIVE DESIGN APPROACH

### 8.1 Mobile-First Indicators
- Hamburger menu for mobile navigation
- `@from-sm` media query breakpoints
- Flexible grid columns (`o-grid_item u-gc-2/3@from-sm`)
- Touch-friendly hit targets (44px minimum implied)

### 8.2 Breakpoint Strategy
- Small devices: Stacked layouts, full-width content
- Medium+: Sidebar layouts, multi-column grids
- Large screens: Full asymmetric layouts with sidebars

---

## 9. ACCESSIBILITY PATTERNS

### 9.1 Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- `<nav>`, `<header>`, `<main>` landmarks
- Skip links for keyboard navigation

### 9.2 ARIA Support
- `aria-expanded` for menu states
- `aria-current="page"` for active navigation
- `aria-hidden` for decorative elements
- Screen reader text (`u-screen-reader-text`)

### 9.3 Focus Management
- Keyboard navigation support
- `data-lenis-prevent` for scroll locking in menu

---

## 10. TECHNICAL PATTERNS

### 10.1 CSS Architecture
- **BEM-like naming**: `c-component_element -modifier`
- **Utility classes**: `u-` prefix for utilities (e.g., `u-anim-title`)
- **Object classes**: `o-` prefix for layout objects (e.g., `o-container`)
- **Component classes**: `c-` prefix for components

### 10.2 Performance Optimization
- Font preloading (WOFF2 format)
- CSS loaded with `media="print"` then switched to `media="all"`
- SVG sprite system for icons
- Lazy loading implied for images

### 10.3 JavaScript Modules
- Data attributes for module initialization: `data-module-menu`, `data-module-scroll`
- Progressive enhancement approach
- Cookie consent module for GDPR compliance

---

## 11. SYNTHESIS & RECOMMENDATIONS

### 11.1 Patterns to Adopt
1. **Monochromatic color palette** with high contrast (dark navy, white, gray)
2. **Large, bold typography** with negative letter-spacing for impact
3. **Geometric loading states** that reflect precision
4. **Full-screen menu overlay** for mobile navigation
5. **Asymmetric grid layouts** (2/3 - 1/3 splits)
6. **Minimal decoration** - let content and structure shine
7. **Custom animations** with cubic-bezier easing

### 11.2 Automotive-Specific Elements
1. Bold, confident typography (large headings)
2. Precision spacing and alignment
3. Technical aesthetic (geometric shapes, clean lines)
4. Monochromatic palette (sophistication and seriousness)
5. Image-first content strategy
6. Minimal color accents (red for urgency/CTAs)

### 11.3 Design System Components to Create
1. **Buttons**: Primary, secondary, outline variants
2. **Cards**: Project/product cards with image + metadata
3. **Hero sections**: Large, impactful entry points
4. **Navigation**: Header, menu, sidebar filters
5. **Typography**: Complete scale with proper hierarchy
6. **Grid system**: Asymmetric layouts with gutters
7. **Icons**: Geometric, minimal style
8. **Forms**: Clean, professional inputs

---

## 12. COMPETITIVE ADVANTAGE

What makes GKC's automotive design effective:

1. **Restraint**: No unnecessary decoration or color
2. **Precision**: Exact spacing, alignment, and typography
3. **Confidence**: Bold typography and large imagery
4. **Professionalism**: Serious tone, minimal playfulness
5. **Technical excellence**: Custom animations, optimized performance
6. **Clarity**: Clear hierarchy, easy navigation

These principles should guide our style guide creation to capture the essence of automotive industry design while applying the existing design system values.
