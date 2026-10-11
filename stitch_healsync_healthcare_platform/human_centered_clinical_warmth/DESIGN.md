---
name: Human-Centered Clinical Warmth
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#404947'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#707977'
  outline-variant: '#bfc8c6'
  surface-tint: '#316761'
  primary: '#003631'
  on-primary: '#ffffff'
  primary-container: '#134e48'
  on-primary-container: '#87beb6'
  inverse-primary: '#9ad1c9'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#003632'
  on-tertiary: '#ffffff'
  tertiary-container: '#004f49'
  on-tertiary-container: '#6dc2b9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5ede5'
  primary-fixed-dim: '#9ad1c9'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#154f49'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#9cf2e8'
  tertiary-fixed-dim: '#80d5cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  sidebar-width: 17.5rem
---

## Brand & Style

This design system establishes a restorative, warm, and distinctly human atmosphere for clinical and operational healthcare experiences. Moving deliberately away from the cold, sterile, high-glare blues and intimidating clinical interfaces of traditional hospital software, the visual tone blends architectural serenity, organic warmth, and operational rigor. 

The aesthetic is built on a tactile, modern editorial baseline: warm ivory surfaces, deep forest teal anchors, and energetic terracotta accents. It balances emotional reassurance for patients facing medical stress with rapid clarity and low visual fatigue for clinicians and administrators managing complex appointment flows. Precision line-work, generous corner radii, and grounded typography eliminate institutional intimidation while preserving diagnostic authority.

## Colors

The palette grounds the interface in nature-inspired, clinical warmth rather than harsh antiseptic tones. 

- **Primary (`#134E48`)**: Deep Forest Teal. Imparts stability, clinical gravitas, and calm authority. Used for primary navigation, top-level brand marks, key headers, and confident base actions.
- **Secondary (`#EA580C`)**: Terracotta Ember. Used selectively for critical points of engagement: high-intent callouts, active booking triggers, pending badges, and focused interactive indicators.
- **Tertiary (`#0F766E`)**: Balanced Vitality Teal. Serves as interactive hover states, subtle active fills, and secondary navigational accents.
- **Neutral (`#1E293B`)**: Deep Slate. The primary text color, delivering optimal contrast without the harsh optical glare of pure pitch black.

### Surface Tiers & Canvas System
- **Canvas Base**: `#FBF9F5` (Warm Alabaster). Soft, eye-relaxing ambient background.
- **Canvas Muted / Sub-tier**: `#F5F2EB` (Warm Ecru). Used for sidebars, grouped filter bays, and page headers.
- **Surface Elevation 01**: `#FFFFFF` (Porcelain). Crisp, high-clarity floating card layer that lifts legibility.
- **Delicate Border**: `#E6E2D8`. Neutral warm contour preventing container bleeding into the canvas.

### Semantic Status Palette
- **Requested / Pending**: Text `#9A3412`, Background `#FFEDD5`, Border `#FDBA74`.
- **Accepted / Active**: Text `#065F46`, Background `#D1FAE5`, Border `#6EE7B7`.
- **Completed**: Text `#0F766E`, Background `#CCFBF1`, Border `#99F6E4`.
- **Cancelled / Alert**: Text `#9F1239`, Background `#FFE4E6`, Border `#FDA4AF`.

## Typography

The type system uses **Plus Jakarta Sans** across all roles to unify precision, approachability, and extreme legibility under high-stress workflows.

- **Headings**: Tight tracking (`-0.01em` to `-0.02em`) with semi-bold to bold weights gives physician credentials, department titles, and clinical dashboards an authoritative, sculpted finish.
- **Body Text**: Generous vertical line-height (1.45x to 1.55x) avoids cognitive strain during rapid triage and lengthy medical history reviews.
- **Tabular Numerals**: Numbers in schedule grids, vital stats, and timestamp readouts should utilize `font-variant-numeric: tabular-nums` to maintain strict visual alignment across patient records.

## Layout & Spacing

The layout philosophy follows a structured fluid grid paired with fixed administrative framing:
- **Desktop (1200px+)**: A dedicated fixed navigational dock (280px / `17.5rem`) anchored on the left, with the operational canvas fluidly occupying the remaining viewport up to a `max-width` of 1600px. Standard 12-column grid with `1.5rem` gutters.
- **Tablet (768px - 1199px)**: 8-column layout. Navigational dock collapses to a condensed 72px rail. Margins adjust to `1.25rem`.
- **Mobile (< 768px)**: 4-column layout. Gutter and screen margins tighten to `1rem`. Floating appointment bars lock to the bottom edge above safe area insets.

Whitespace is treated as a clinical tool to reduce information density. Dense tables, consultation notes, and intake cards must feature structured inner cell padding (`space-sm` to `space-md`) so data fields remain immediately scannable.

## Elevation & Depth

Visual hierarchy uses a calm, atmospheric elevation model that avoids stark drop shadows. Shadows are tinted with forest teal and warm umber rather than cold neutral gray.

- **Level 0 (Flat Canvas)**: Direct `#FBF9F5` warm ivory substrate without shadow.
- **Level 1 (Porcelain Cards & Lists)**: `#FFFFFF` fill with a subtle 1px border (`#E6E2D8`) and an ambient glow: `0 2px 8px -2px rgba(19, 78, 72, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)`.
- **Level 2 (Interactive Floating Cards / Active Pickers)**: Used for hovered calendar slots and selected physician profiles: `0 8px 24px -4px rgba(19, 78, 72, 0.08), 0 2px 6px -1px rgba(19, 78, 72, 0.03)`.
- **Level 3 (Modals & Slide-out Panels)**: Floating appointment modals and clinical drawer overlays: `0 20px 32px -8px rgba(19, 78, 72, 0.12), 0 6px 12px -3px rgba(0, 0, 0, 0.04)`.

## Shapes

The interface embraces organic curvature to soften operational intensity and project gentle approachability:
- **Base Components**: Inputs, action buttons, table cells, and dropdown items utilize a `0.5rem` (8px) radius.
- **Cards & Consultation Blocks**: Structural surface cards feature generous `1rem` (16px) corners, framing patient data within friendly containers.
- **Specialized Dialogs & Deep Focus Surfaces**: High-profile containers and doctor profile sheets carry `1.25rem` to `1.5rem` (20px to 24px) corners.
- **Pills**: Badges, time slots, chips, and online indicators use full pill rounding (`9999px`) to invite touch and rapid interaction.

## Components

### Buttons
- **Primary Button**: Solid Deep Forest Teal (`#134E48`) fill, white text, 8px radius, height 44px (`padding: 0 1.25rem`). Subtle micro-hover lifting to `#0F766E`.
- **Accent / Call-to-Action Button**: Terracotta (`#EA580C`) fill with white text for decisive transactional steps (e.g., "Confirm Appointment"). Hover to `#C2410C`.
- **Secondary Button**: `#FFFFFF` background, `#134E48` text, and a crisp 1px `#E6E2D8` border. Hover changes background to `#F5F2EB`.
- **Ghost Button**: Transparent fill, `#134E48` text, hover background `rgba(19, 78, 72, 0.05)`.

### Chips & Time Slots
- **Time Slot Available**: Pill shape, porcelain white background, 1px border (`#E6E2D8`), text `#1E293B`.
- **Time Slot Selected**: Deep Forest Teal (`#134E48`) background, white text, 1px border (`#134E48`).
- **Time Slot Disabled**: Transparent background, text `#94A3B8`, border `dashed 1px #E2E8F0`.

### Form Controls & Input Fields
- **Input Fields**: 44px height, `#FFFFFF` background, 1px border (`#E6E2D8`), text `#1E293B`, 8px corner radius. Placeholder in `#94A3B8`.
- **Focus State**: 1px `#134E48` border accompanied by an ambient focus ring: `box-shadow: 0 0 0 3px rgba(19, 78, 72, 0.15)`.
- **Checkboxes & Radios**: Custom rounded squares (radios circular) with 1.5px `#CBD5E1` borders; checked state fills with Deep Forest Teal displaying a crisp white icon check.

### Cards & Doctor Profiles
- **Profile Cards**: Built with a white surface layer on warm ivory canvas. Left-anchored circular or rounded-2xl physician portrait (56px–72px), paired with specialized department badges, rating stars, and availability pills.
- **Micro-Borders**: All cards must enforce a consistent 1px solid border in `#E6E2D8` to preserve shape definition against warm canvas backgrounds.

### Data Tables (Operational & Administration)
- **Table Container**: Encapsulated within a porcelain card with 16px corner radii.
- **Table Headings**: `#F5F2EB` background, uppercase 11px label font (`#64748B`), with 12px vertical padding.
- **Table Rows**: Crisp `#FFFFFF` row items separated by 1px dividers (`#F1EFE9`). Hover row transition to `rgba(245, 242, 235, 0.6)`.