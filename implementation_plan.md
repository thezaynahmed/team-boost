# Floating Navbar Implementation Plan

## 1. Structure
- [ ] Create `components/layout/floating-navbar.tsx`.

## 2. Design Specs
- [ ] **Container**: Fixed, centered capsule (`fixed top-6 left-1/2 -translate-x-1/2`).
- [ ] **Glassmorphism**: `bg-black/50 backdrop-blur-xl border border-white/10 rounded-full`.
- [ ] **Animations**:
  - Entrance: Slide down from top (`y: -100` -> `y: 0`).
  - Hover: "Spotlight" effect moving behind links (`layoutId`).
  - Mobile: Expandable menu with spring physics.
- [ ] **Links**: Features, Wall, Pricing.
- [ ] **Buttons**:
  - Login (Text/Ghost).
  - Get Started (Gradient Border).

## 3. Integration
- [ ] Replace `SiteHeader` in `app/page.tsx` and `app/public/page.tsx` with `FloatingNavbar`.
