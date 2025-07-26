# DayMatrix - Productivity Time Management Application

## Project Overview
I'm creating a productivity and time management application called "DayMatrix" built with Angular frontend and Supabase backend. The application is fundamentally based on the Eisenhower Matrix concept for task prioritization, though this concept should not be explicitly mentioned in headers, title tags, or meta descriptions - it can be referenced as a feature within the home page sections.

## Visual Design & Theme System

### Glassmorphism Aesthetic
The visual design centers around a sophisticated glassmorphism aesthetic implemented throughout the entire application. The glassmorphism implementation must be comprehensive, creating a rich and premium visual experience that follows industry best practices for high-end interface design. Every element should exhibit authentic glass-like transparency effects and sophisticated blur treatments.

### Dual Theme System
I need to develop two distinct themes:
- **Dark Theme**: Pure black background with white street light-inspired illumination effects highlighting key interface elements
- **Light Theme**: Ivory white background with warm yellow street light-style lighting

The street light theme concept means that primary interface elements and important content areas should appear within illuminated zones that mimic the focused lighting areas created by street lamps.

### Theme Switching
Both themes should include theme switching functionality accessible from both the navigation bar and footer areas.

## Color Palette
- **Light Theme**: `#1c5f78`
- **Dark Theme**: `#0db3d9`
- **Accent Color**: `#b00457` (used consistently across both theme variations)

## Animation & Visual Effects
The entire application should feature smooth animations and incorporate three-dimensional visual elements to create engaging 3D effects throughout the user interface.

## Technical Requirements

### Responsive Design
Responsive design is critical, with particular attention to navigation bar responsiveness to ensure optimal functionality across all device sizes. No interface elements should experience overflow issues on any screen size.

### Server-Side Rendering Considerations
Since this application uses server-side rendering, I must implement proper browser detection before utilizing browser-specific APIs like localStorage to prevent hydration errors.

### Modern Angular Best Practices
The development should follow modern Angular best practices as outlined in the best-practises.md file, specifically avoiding deprecated structural directives like `*ngIf` and `*ngFor` in favor of the latest `@if()` and `@for()` control flows.

### Assets Location
Application logos and visual assets are stored in the "public" folder and should be properly referenced throughout the interface.

## Initial Development Phase Components

### 1. Navigation Bar
- Floating-design navigation bar that maintains a suspended appearance
- Must maintain floating appearance while being fully responsive
- Include theme switching functionality
- Seamlessly integrate glassmorphism theme system with smooth transitions

### 2. Footer Component
- Follow the floating design pattern
- Include theme switching functionality
- Integrate glassmorphism aesthetic

### 3. Home Page
- Comprehensive home page with glassmorphism integration
- **Header Section Requirements**:
 - Feature an animated representation of the Eisenhower Matrix
 - Respond to user interaction with tilting animations on hover
 - Incorporate signature blur and glass effects
 - Maintain the application's visual identity

## Design Integration
All components should seamlessly integrate the glassmorphism theme system with smooth transitions between the black street light and ivory yellow street light themes, maintaining the rich and premium look throughout the application.