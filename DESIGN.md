# Design Brief: Emergency Help Website

## Purpose & Context
Life-safety interface for rapid emergency service access under stress. Requires immediate visual clarity, high contrast, and panic-optimized interactions.

## Tone
Utilitarian emergency dispatch aesthetic — clinical, authoritative, purposeful. Not decorative or trendy. Every pixel serves function.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Red (Destructive) | 0.55 0.22 25 | Ambulance, fire, maximum urgency |
| Blue (Primary) | 0.60 0.18 250 | Police, authority, trusted action |
| Orange (Secondary) | 0.65 0.22 40 | Road accident, disaster, warning |
| Pink (Accent) | 0.65 0.15 330 | Helplines, support, care services |
| White (Background) | 0.98 0 0 | Light mode clean surface |
| Charcoal (Dark BG) | 0.12 0 0 | Dark mode reduced eye strain |

## Typography
- **Display**: Space Grotesk (geometric, modern dispatch feel, headlines)
- **Body**: Plus Jakarta Sans (readable at small sizes, humanitarian tone)
- **Mono**: JetBrains Mono (emergency codes, phone numbers)

## Shape Language
- **Button radius**: 16px (rounded corners soften urgency without losing clarity)
- **Card radius**: 12px (consistent, cohesive)
- **Panic button radius**: 20px (maximum emphasis)

## Elevation & Depth
- **Subtle shadow**: 2px 4px 8px, 8% opacity (cards, secondary surfaces)
- **Medium shadow**: 4px 8px 16px, 12% opacity (elevated interactive elements)
- **Elevated shadow**: 8px 16px 32px, 15% opacity (panic button, focus states)

## Structural Zones

| Zone | Treatment |
|------|-----------|
| Header | Clean white (light) / charcoal (dark), 12px padding, subtle bottom border, theme toggle right-aligned |
| Service Grid | 2-column mobile (gap 12px), 3-column tablet, 4-column desktop, responsive spacing |
| Panic Zone | Full-width bottom section, red destructive button (64px+ height), pulse animation, maximum visual weight |
| Footer | Muted background, contact info, minimal footer treatment |

## Spacing & Rhythm
- **Padding unit**: 16px base (8px, 16px, 24px, 32px increments)
- **Gap**: 12px between grid items, scales with breakpoint
- **Type scale**: 12px (labels) → 14px (body) → 16px (button) → 20px (heading) → 28px (display)

## Component Patterns
- **Emergency buttons**: Min 64px height, icon + label, color-coded by service type, tap feedback (active:scale-95)
- **Panic button**: Full-width, 80px+ height, destructive red, pulsing animation, no secondary text
- **Toggle (theme)**: Minimal icon button, top-right header, smooth transition
- **Card**: Elevated surface, 12px radius, border, shadow, hover lift effect

## Motion & Interaction
- **Default transition**: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) smooth curve
- **Panic button pulse**: 2s infinite opacity oscillation (1.0 → 0.7 → 1.0)
- **Theme toggle**: Cross-fade transition on background/text colors
- **Active state**: scale-95 on button press (tactile feedback without bounce)

## Constraints
- Mobile-first responsive (sm: 640px, md: 768px, lg: 1024px)
- Minimum touch target: 48x48px (actual buttons 64px+ for emergency use)
- AA+ contrast in light and dark modes
- No animations on reduced-motion preference
- Offline-capable basic features (progressive enhancement)

## Differentiation
Semantic color mapping (red = urgency, blue = authority, orange = hazard, pink = support) creates instant visual scanning hierarchy without requiring text. Generous padding and shadows provide tactile feedback critical in crisis moments. Panic button pulse animation draws attention without startling. Dark mode uses deep black backgrounds to reduce eye strain in emergency scenarios.

## Signature Detail
Pulse animation on panic button creates visual urgency — constant gentle oscillation signals "act now" without aggressive flashing. Color-to-service semantic binding (red ambulance, blue police, orange hazard, pink support) allows recognition at a glance.
