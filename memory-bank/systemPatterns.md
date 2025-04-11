# System Patterns: Dog Walking Business Website

## Architecture Overview

The website follows a client-side architecture with a focus on simplicity and maintainability. It uses a component-based approach for organization while keeping the technology stack lightweight.

```
┌─────────────────────────────────────────────┐
│                  Client Side                │
│                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │   UI    │    │ Business│    │  Data   │  │
│  │  Layer  │◄───┤  Logic  │◄───┤  Layer  │  │
│  │         │    │  Layer  │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## Key Design Patterns

### Component Pattern
The UI is organized into reusable components that encapsulate specific functionality:
- **Navigation Component**: Handles smooth scrolling between sections
- **Image Carousel Component**: Manages the rotating images on the home page
- **Calendar Component**: Displays available booking slots
- **Booking Form Component**: Collects customer and dog information
- **Payment Component**: Handles the Stripe payment integration

### Observer Pattern
Used for implementing the scroll-based animations and navigation:
- Intersection Observer API monitors element visibility
- Triggers animations when elements enter the viewport
- Updates navigation state based on current scroll position

### Module Pattern
JavaScript code is organized into modules with specific responsibilities:
- **main.js**: Core application initialization and coordination
- **scroll.js**: Scroll effects and section transitions
- **booking.js**: Booking system logic and validation
- **payment.js**: Payment processing integration

### State Management
Simple state management for the booking system:
- Tracks available slots and current bookings
- Maintains form state during the booking process
- Persists booking data in local storage

## Component Relationships

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Home Page    │     │  Services Page  │     │   Booking Page  │
│                 │     │                 │     │                 │
│  ┌───────────┐  │     │  ┌───────────┐  │     │  ┌───────────┐  │
│  │  Carousel │  │     │  │  Service  │  │     │  │ Calendar  │  │
│  └───────────┘  │     │  │   Cards   │  │     │  └───────────┘  │
│                 │     │  └───────────┘  │     │                 │
│  ┌───────────┐  │     │                 │     │  ┌───────────┐  │
│  │   Hero    │  │     │  ┌───────────┐  │     │  │  Booking  │  │
│  │  Section  │  │     │  │Testimonial│  │     │  │   Form    │  │
│  └───────────┘  │     │  │  Section  │  │     │  └───────────┘  │
│                 │     │  └───────────┘  │     │                 │
└─────────────────┘     └─────────────────┘     │  ┌───────────┐  │
                                                │  │  Payment   │  │
                                                │  │   Form     │  │
                                                │  └───────────┘  │
                                                │                 │
                                                └─────────────────┘
```

## Critical Implementation Paths

### Scroll-Based Navigation
1. Detect scroll position using Intersection Observer
2. Highlight active navigation item
3. Trigger section animations based on visibility

### Booking System Flow
1. Display calendar with available dates
2. Validate selected date has fewer than 2 bookings
3. Collect customer and dog information
4. Validate form inputs
5. Process payment through Stripe
6. Store booking information
7. Display confirmation

### Responsive Design Implementation
1. Mobile-first CSS approach
2. Breakpoint-based layout adjustments
3. Touch-friendly interactions for mobile users
4. Optimized image loading for different screen sizes

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Input  │────►│ Form Validation │────►│  Data Storage │
└──────────────┘     └──────────────┘     └──────────────┘
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌──────────────┐
                    │ Payment Processing │◄────┤ Booking Logic │
                    └──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Confirmation │
                    └──────────────┘
```

## Technical Decisions

### Single Page Approach
- Chosen for smooth transitions between sections
- Improves perceived performance
- Simplifies state management
- Enhances user experience with animations

### Local Storage for Demo
- Simplifies implementation for demonstration purposes
- Avoids need for backend server and database
- Provides realistic user experience
- Can be replaced with proper backend in production

### Stripe Integration
- Industry-standard payment processing
- Well-documented API with strong developer support
- Secure handling of sensitive payment information
- Customizable UI that can match site aesthetics
