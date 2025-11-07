# Automotive Design System - Style Guide

A precision-engineered design system inspired by the automotive industry, created with pure HTML, CSS, and vanilla JavaScript. No frameworks, no dependencies—just clean, performant code.

## 🎯 Overview

This style guide provides a complete design system for automotive-focused digital experiences. It includes:

- **Design Research**: Analysis of GKC's automotive sector patterns
- **Low-Fidelity Wireframes**: Structure and layout foundations
- **High-Fidelity Mockups**: Fully styled, interactive pages
- **Component Library**: Reusable UI components with documentation
- **Comprehensive Documentation**: Style guide with usage guidelines

## 📁 Project Structure

```
/automotive-style-guide/
├── README.md                          # This file
├── style-guide.html                   # Main style guide documentation
│
├── /wireframes/                       # Low-fidelity layouts
│   ├── index.html                     # Wireframe showcase
│   └── wireframes.css                 # Wireframe-specific styles
│
├── /mockups/                          # High-fidelity mockups
│   ├── index.html                     # Complete page mockup
│   ├── styles.css                     # Full design system CSS
│   └── script.js                      # Vanilla JS interactions
│
├── /components/                       # Individual components
│   ├── buttons.html                   # Button component library
│   ├── cards.html                     # Card component library
│   └── navigation.html                # Navigation component library
│
└── /research/                         # Design research
    └── design-patterns-analysis.md    # GKC automotive analysis
```

## 🚀 Quick Start

### Option 1: View in Browser
Simply open any HTML file in your web browser:

```bash
# Main style guide documentation
open style-guide.html

# Wireframes
open wireframes/index.html

# Mockups
open mockups/index.html

# Components
open components/buttons.html
```

### Option 2: Local Server (Recommended)
For best results, use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then navigate to:
- **Style Guide**: http://localhost:8000/style-guide.html
- **Wireframes**: http://localhost:8000/wireframes/index.html
- **Mockups**: http://localhost:8000/mockups/index.html

## 🎨 Design System Foundations

### Color Palette

```css
/* Primary Colors */
--color-primary-dark: #151f26;  /* Main text, borders, backgrounds */
--color-white: #ffffff;         /* Backgrounds, text on dark */
--color-gray: #a2a2a2;          /* Secondary text, subtle elements */

/* Accent Colors */
--color-accent-red: #ff0000;    /* CTAs, hover states, urgency */
--color-accent-blue: #1444f0;   /* Links, secondary accents */
```

### Typography

```css
/* Font Families */
--font-primary: 'ABCDiatype', -apple-system, system-ui, sans-serif;
--font-condensed: 'SuisseIntlCond', -apple-system, system-ui, sans-serif;

/* Type Scale */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 18px;
--text-lg: 24px;
--text-xl: 30px;
--text-2xl: 48px;
--text-3xl: 83.3333px;
```

### Spacing System (8px base)

```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-2xl: 64px;
--space-3xl: 96px;
```

## 🧩 Components

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Large Button -->
<button class="btn btn-primary btn-large">Large CTA</button>
```

### Cards

```html
<!-- Feature Card -->
<article class="feature-card">
    <div class="feature-icon">
        <!-- SVG icon -->
    </div>
    <h3 class="feature-title">Feature Title</h3>
    <p class="feature-description">Description text</p>
    <a href="#" class="feature-link">Learn more →</a>
</article>

<!-- Portfolio Card -->
<article class="portfolio-item small">
    <div class="portfolio-image">
        <div class="image-placeholder"></div>
    </div>
    <div class="portfolio-content">
        <span class="label">Category</span>
        <h3 class="portfolio-title">Project Title</h3>
    </div>
</article>
```

### Navigation

```html
<!-- Fixed Header -->
<header class="header" id="header">
    <div class="header-inner">
        <a href="#" class="logo">
            <!-- Logo SVG -->
        </a>
        <button class="menu-toggle" id="menuToggle">
            <span class="menu-label">Menu</span>
            <span class="menu-icon">
                <span class="menu-line"></span>
                <span class="menu-line"></span>
                <span class="menu-line"></span>
            </span>
        </button>
    </div>
</header>
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (mobile) */
@media (max-width: 768px) {
    /* Mobile styles */
}

/* Medium devices (tablets) */
@media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet styles */
}

/* Large devices (desktop) */
@media (min-width: 1025px) {
    /* Desktop styles */
}
```

## 🎭 Key Features

### Pure HTML/CSS/JS
- **No frameworks or libraries** (React, Vue, etc.)
- **No CSS preprocessors** (Sass, Less)
- **No build tools required** (Webpack, Vite)
- **Vanilla JavaScript only** for interactions

### Accessibility
- ✅ Semantic HTML5 elements
- ✅ ARIA labels and attributes
- ✅ Keyboard navigation support
- ✅ WCAG AA color contrast (4.5:1 minimum)
- ✅ Screen reader friendly
- ✅ Skip links for navigation

### Performance
- ✅ CSS custom properties (variables)
- ✅ Transform-based animations
- ✅ Optimized cubic-bezier easing
- ✅ No external dependencies
- ✅ Clean, minimal code

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔍 Design Inspiration

This design system is inspired by [GKC's Automotive Sector](https://gkc.ca/en/project-sectors/categories/automotive), incorporating:

- **Precision engineering aesthetic**: Clean lines, exact spacing
- **Monochromatic palette**: Professional, technical feel
- **Bold typography**: Confident, impactful headings
- **Asymmetric grids**: Dynamic, engaging layouts
- **Minimal decoration**: Content-first approach

See `/research/design-patterns-analysis.md` for complete analysis.

## 📖 Documentation Pages

### 1. Style Guide (`style-guide.html`)
Complete design system documentation including:
- Color system with usage guidelines
- Typography scale and implementation
- Spacing system
- Grid patterns
- Component overview
- Quick reference guide

### 2. Wireframes (`wireframes/index.html`)
Low-fidelity layouts showing:
- Header and navigation structure
- Hero section layout
- Features/services grid
- Portfolio gallery (asymmetric)
- CTA sections
- Footer structure

### 3. Mockups (`mockups/index.html`)
High-fidelity, fully styled page with:
- Complete visual design applied
- Interactive elements (menu, filters)
- Responsive layouts (mobile → desktop)
- Hover states and transitions
- Real component implementations

### 4. Component Libraries
Individual showcase pages for:
- **Buttons** (`components/buttons.html`): All button variants
- **Cards** (`components/cards.html`): Feature, portfolio, stat cards
- **Navigation** (`components/navigation.html`): Header, menu, filters

## 🛠 Customization

### Changing Colors

Edit CSS custom properties in `mockups/styles.css`:

```css
:root {
    --color-primary-dark: #151f26;  /* Change to your brand color */
    --color-accent-red: #ff0000;    /* Change to your accent color */
}
```

### Adjusting Typography

Modify font families and sizes:

```css
:root {
    --font-primary: 'YourFont', sans-serif;
    --text-base: 16px;  /* Adjust base size */
}
```

### Responsive Breakpoints

Adjust breakpoint values to match your needs:

```css
@media (max-width: 768px) { /* Change to 640px, 1024px, etc. */ }
```

## 🎓 Learning Resources

### CSS Grid Layouts
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- Used extensively for asymmetric portfolio layouts

### CSS Custom Properties
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- Foundation of the design token system

### Vanilla JavaScript
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- Simple, framework-free interactions

## 🐛 Known Limitations

1. **Font Files Not Included**: ABCDiatype and SuisseIntlCond fonts fall back to system fonts. Replace with licensed versions or substitute with similar fonts.

2. **Image Placeholders**: All images use gradient placeholders. Replace with actual images in production.

3. **No Build Process**: Since there's no build step, CSS is not minified. Consider minification for production.

## 🚧 Future Enhancements

Potential additions (maintaining pure HTML/CSS/JS approach):

- [ ] Form components (inputs, selects, checkboxes)
- [ ] Modal/dialog patterns
- [ ] Accordion/collapse components
- [ ] Tab navigation patterns
- [ ] Tooltip/popover patterns
- [ ] Alert/notification components
- [ ] Loading states and skeletons
- [ ] Dark mode variant

## 📝 Implementation Checklist

When implementing this design system:

- [ ] Replace font references with actual font files
- [ ] Add real images to replace placeholders
- [ ] Customize color palette to match brand
- [ ] Adjust spacing scale if needed
- [ ] Test on target devices/browsers
- [ ] Validate HTML (W3C Validator)
- [ ] Check accessibility (WAVE, axe DevTools)
- [ ] Optimize for performance (Lighthouse)
- [ ] Add meta tags for SEO
- [ ] Configure analytics if needed

## 🤝 Contributing

This is a style guide template. To adapt it:

1. Fork or copy the directory
2. Customize CSS variables to your brand
3. Replace placeholder content
4. Add/remove components as needed
5. Extend the design system

## 📄 License

This style guide is provided as-is for educational and commercial use. The design patterns are inspired by GKC's automotive sector but represent an original interpretation.

## 🙏 Acknowledgments

- **Design Inspiration**: [GKC Architecture & Design](https://gkc.ca/)
- **Font Inspiration**: ABCDiatype and SuisseIntlCond
- **Methodology**: Research-driven design system development

---

## 📞 Support

For questions or issues:

1. Review the style guide documentation (`style-guide.html`)
2. Check component examples in `/components/`
3. Refer to design research in `/research/`

## 🎉 Getting Started - Quick Commands

```bash
# Navigate to the project directory
cd automotive-style-guide

# Start a local server (pick one):
python3 -m http.server 8000
# or
npx http-server -p 8000

# Open in browser:
# http://localhost:8000/style-guide.html
```

**Enjoy building with the Automotive Design System!** 🚗
