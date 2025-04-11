# Technical Context: Dog Walking Business Website

## Technology Stack

### Frontend Technologies
- **HTML5**: Semantic markup for content structure
- **CSS3**: Styling with modern features including:
  - Flexbox and Grid for layouts
  - CSS Variables for consistent theming
  - CSS Animations for transitions and effects
  - Media queries for responsive design
- **JavaScript (ES6+)**: Client-side functionality including:
  - DOM manipulation
  - Event handling
  - Fetch API for potential future backend integration
  - Local Storage API for data persistence

### Frameworks & Libraries
- **Bootstrap 5**: Frontend framework for responsive design
  - Grid system for layouts
  - Component library for UI elements
  - Utility classes for rapid development
- **Alpine.js** (optional): Lightweight JavaScript framework for reactivity
  - Declarative syntax for dynamic behavior
  - Simple state management
- **Vanilla JS Calendar**: Lightweight date picker for booking system
- **Stripe.js**: Payment processing integration

### Development Tools
- **Git**: Version control
- **VS Code**: Code editor
- **Chrome DevTools**: Debugging and testing
- **Lighthouse**: Performance and accessibility testing

## Development Setup

### Local Development Environment
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- No build tools or preprocessors required for simplicity
- Live Server extension for local development

### File Organization
```
dog-walker-website/
├── index.html                # Main HTML file with all three "pages"
├── css/
│   ├── styles.css            # Main styles
│   ├── animations.css        # Scroll animations and transitions
│   └── responsive.css        # Mobile responsiveness
├── js/
│   ├── main.js               # Core functionality
│   ├── scroll.js             # Scroll effects and navigation
│   ├── booking.js            # Booking system logic
│   └── payment.js            # Payment integration
├── images/                   # Image assets
└── memory-bank/              # Project documentation
```

### Coding Standards
- HTML: Semantic markup, accessibility-focused
- CSS: BEM naming convention for classes
- JavaScript: ES6+ features, modular organization
- Comments: JSDoc style for functions and components

## Technical Constraints

### Performance Targets
- **Page Load**: < 2 seconds on 4G connection
- **Time to Interactive**: < 3 seconds
- **Lighthouse Score**: > 90 for Performance, Accessibility, Best Practices, SEO

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari and Android Chrome (latest 2 versions)

### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

### Technical Limitations
- **Client-Side Only**: No server-side processing
- **Local Storage**: Limited to 5MB per domain
- **Payment Processing**: Requires Stripe account setup
- **Image Optimization**: Manual process for performance

## Dependencies

### External Services
- **Stripe**: Payment processing
  - Requires Stripe account
  - Test mode available for development
  - Production mode requires business verification

### Third-Party Libraries
- **Bootstrap 5**: ~200KB (minified and gzipped)
  - Can be loaded via CDN
  - Modular import available to reduce size
- **Alpine.js** (optional): ~7KB (minified and gzipped)
- **Vanilla JS Calendar**: ~15KB
- **Stripe.js**: Loaded dynamically when needed

### Assets
- **Images**: 10+ high-quality dog walking photos
  - Recommended format: WebP with JPEG fallback
  - Optimized for web (< 100KB each)
- **Icons**: SVG format for scalability
  - Can use Bootstrap icons or custom SVGs
- **Fonts**: Google Fonts or system fonts
  - Limit to 2 font families for performance

## Tool Usage Patterns

### Development Workflow
1. Create HTML structure for all sections
2. Implement base CSS styling
3. Add JavaScript functionality
4. Implement responsive design
5. Add animations and transitions
6. Integrate booking system
7. Integrate payment processing
8. Test and optimize

### Testing Approach
- **Cross-Browser Testing**: Manual testing on major browsers
- **Responsive Testing**: Chrome DevTools device emulation
- **Performance Testing**: Lighthouse audits
- **Accessibility Testing**: WAVE or axe browser extensions
- **User Flow Testing**: Manual testing of booking process

### Deployment Options
- **GitHub Pages**: Free static site hosting
- **Netlify**: Free tier with form handling capabilities
- **Vercel**: Free tier with excellent performance

### Maintenance Considerations
- **Content Updates**: Direct HTML edits
- **Style Changes**: CSS modifications
- **Functionality Updates**: JavaScript modifications
- **Dependency Updates**: Manual updates of CDN links
