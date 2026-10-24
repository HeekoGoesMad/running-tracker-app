# UI and UX review — revision 2

Status: candidate for owner review. Android implementation is on hold. The original reports remain the planning baseline; this review supersedes their schematic illustration only after approval.

## Direction

Quiet graphite, off-white typography and a controlled lime accent. Give the next workout, the recording clock and the route different compositions because they serve different tasks. Use flat sections and useful dividers; reserve raised surfaces for a selected workout, a modal task or grouped controls. No orange, purple gradients, social feed, subscription prompts or decorative dashboard tiles.

Pair **Manrope** for interface copy with **Roboto Condensed** for large workout numbers. Both come from the official Google Fonts repositories, with their licenses retained. The pairing is our design decision, informed by the user's Figma typography articles, rather than a pairing claimed to appear verbatim in those articles.

## Reference evidence

| Reference studied | Useful structure | Our response |
| --- | --- | --- |
| Supplied Strava recorder and map screenshots | Large time and distance; accessible recording controls; map and metrics views | Preserve the hierarchy and visible GPS state; use our own typography, route geometry and controls |
| Supplied Strava activity and progress screenshots | Activity summaries followed by route and trends | Personal training journal with flat rows; no feed or follower information |
| Supplied transparent sharing examples | Template picker, editable fields, large preview, checkerboard transparency | Separate composition and privacy steps; four free templates; no copied branding |
| Fitness App Darkmode Minimalism Community preview | Strong headline, restrained dark canvas, compact bottom navigation | Use the dark hierarchy; reject its purple gradients and decorative rings |
| Figma minimalist fonts and font-pairing articles | Legibility, meaningful contrast, spacing and limited families | Manrope for reading, condensed numerals for quick scanning; clear units |
| Figma color-combination and palette articles | Harmonious base, purposeful accents and contrast | Neutral graphite base; one lime action accent; semantic warning and error colors |

## Screen contract

- Today answers what to do next; primary action starts that workout.
- Plan answers what happens this week; primary action opens a workout or reviews a proposed change.
- Record answers whether recording is active and what the runner should do; pause is always reachable and finishing requires a separate review.
- Maps answers which saved route to follow; population popularity remains an external service.
- Progress answers what changed over time; charts have units, summaries and an activity-list alternative.
- Share answers exactly what will leave the device; the preview follows selected fields and route privacy.
- Settings answers where data lives and what access is enabled; no account is required.

## Layout and state rules

Baseline 400 × 900 logical pixels, 24-pixel content inset, 4-pixel spacing scale. Core navigation has five labeled destinations and Android conventions. Phone frames use a generic Android status bar, not an iPhone notch. Controls have at least 48-pixel targets; the recorder uses 64-pixel controls. Scrollable content stays clear of the action area. Add compact 320-pixel and large-text review frames, and light-theme counterparts for the five main screens.

Show ready, loading, empty, permission denied, weak GPS, paused, interrupted, saved, offline, conflict and invalid-file states in the review inventory. Illustrative history, routes and effort responses contain no personal location or health data. A route drawing is a schematic, not live map tiles or a navigable trail.

## Motion contract

Occasional navigation uses a 200 ms opacity/short spatial transition for orientation. Press feedback is immediate, with a 100 ms return from scale 0.97. Numerical recording updates are instant: no rolling digits, counting-up animation or repeated chart drawing. Sheets enter and leave along the same path. Reduced-motion preview uses a 120 ms opacity transition; keyboard navigation is instant. Hover motion is gated to a fine pointer. Figma includes click-through transitions; the local review preview implements the reduced-motion and press behavior. Neither establishes native Android gesture or device-performance validation.

## Completion evidence

Editable Figma text/vector layers, reusable components and token bindings; named frames covering the inventory; connected critical flows; accessible local review gallery; per-frame layout checks and visual inspection. Acceptance remains the project owner's visual review. No APK, GPS recording or medical coaching validation is claimed.

## Sources

- [Community visual reference](https://www.figma.com/community/file/1328586164766653621/fitness-app-darkmode-minimalism)
- [Minimalist fonts](https://www.figma.com/resource-library/minimalist-fonts/)
- [Font pairings](https://www.figma.com/resource-library/font-pairings/)
- [Color combinations](https://www.figma.com/resource-library/color-combinations/)
- [Types of color palettes](https://www.figma.com/resource-library/types-of-color-palettes/)
