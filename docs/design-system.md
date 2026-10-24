# Running Tracker App UI and UX Design System

> This is the original proposed baseline. The owner requested a redesign before Android work. See the [84-frame candidate review](../design/review/README.md) for the revised typography, palette and screen compositions. It awaits owner feedback; the original Word report has not been rewritten as an approved design.

Planning baseline: 24 October 2026. Status: proposed, not implemented.


## Executive summary

Design a calm, data-focused personal running app with a charcoal and electric-lime identity. The interface must make recording obvious, training adjustments understandable, and sharing controllable. Dark mode is the default; a full light theme supports daylight use. The app is for one Android runner, with no feed, advertising, subscription or paywall.

The design system below specifies navigation, type, colors, spacing, components, screen behavior, accessibility and the future Figma handoff. The cover contains original schematic layout studies with illustrative values, not screenshots of an implemented application. A complete editable Figma file is a subsequent deliverable.


### At a glance

| Decision | Specification | Purpose |
| --- | --- | --- |
| Identity | Charcoal, electric lime and warm neutral surfaces | Distinct from Strava's orange visual identity |
| Typography | Bundled Roboto; regular, medium, semibold and bold | Stable cross-device rendering and readable statistics |
| Navigation | Today, Plan, Record, Maps, Progress | Direct access to the five recurring personal tasks |
| Interaction | Native Android conventions, immediate feedback, restrained motion | Apply Apple and Emil craft principles without importing web behavior literally |
| Content | Progressive detail, explicit units and honest unavailable states | Keep the interface minimal without hiding useful information |


### Introduction

The runner needs a reliable sequence from preparing a workout to reviewing its result. The primary design constraint is attention during exercise: essential metrics and controls must be recognizable at a glance. Secondary analysis, template customization and detailed program editing belong in calmer post-run contexts. Design choices here are specifications, not findings from usability testing.


## Key findings


### Reference evidence and implications

| Reference | Observed or requested pattern | Design response |
| --- | --- | --- |
| Supplied Strava screenshots | Large live metrics, route previews, weekly totals, training log and share picker | Retain useful hierarchy; remove social and subscription sections |
| Supplied transparent sharing examples | Template selection, route outline, selectable statistics and transparency preview | Build an original share composer with true alpha exports and field controls |
| Figma Community reference [S29] | User-selected dark minimal fitness direction | Use as a visual reference in the Figma stage; do not claim its exact font, tokens or internals were extracted |
| Apple Design and Emil Design Engineering skills | Direct manipulation, immediate response, interruption and restrained purposeful motion | Use native Android components and gesture behavior with documented timing and reduced-motion alternatives |
| Adaptive Coach requirement | The runner must understand and control plan changes | Use a before/after review, visible reasons, protected workouts and undo |


### Implications

The dashboard should answer what to do next and how the week is progressing. Detailed history belongs in Progress. Recording receives a dedicated full-screen mode without competing navigation. Maps is focused on saved routes and location; it does not promise route generation or embedded population data. The public portfolio uses original diagrams and anonymized illustrative values only.


### Information hierarchy

On each screen, show one primary task, one dominant statistic or decision, and secondary detail below. Use small labels with large values only where a comparison is immediately useful. Avoid a dashboard full of equally weighted cards. A section may be a simple divided row rather than a container; reserve raised surfaces for selected, interactive or grouped content.


## Recommendations


### Navigation and screen map

| Destination | Primary content | Actions and related screens |
| --- | --- | --- |
| Today | Next workout, weekly minutes/distance, check-in and recent activity | Start workout; enter check-in; review pending coach proposal |
| Plan | Week calendar and workout list; generated or manual programs | Create plan; edit steps; pin workout; review changes; calendar connection |
| Record | GPS readiness and workout selection; active/paused recording | Start; pause/resume; change metric/map view; finish and save |
| Maps | Selected route, saved-route list, offline status and current position | Follow route; download small area; open external popular-routes heatmap |
| Progress | History, weekly trends, consistency and activity detail | Filter; inspect splits; edit title/notes; export; open Share |
| Settings | Accessible from the top app bar, not a sixth bottom tab | Theme, units, cues, permissions, calendar, backups, privacy and diagnostics |

Use a 64 dp bottom navigation container plus the system inset, 24 dp icons and persistent text labels. Give Record a restrained emphasized icon/indicator, not an oversized floating button that covers content. The active recorder hides bottom navigation; leaving it returns to the normal shell with a persistent recording status banner. Android system Back and predictive navigation must remain supported.


### Headers and page structure

Top-level pages use a 64 dp app bar below the status inset with a 28 sp semibold title and one settings action. Detail screens use a back arrow, 20 sp title and at most one contextual action. Full-screen task screens use Close, a 20 sp task title and a relevant action only when valid. Calendar and sharing have explicit Save/Apply actions; system Back preserves an unfinished draft. Do not add greeting banners or profile avatars without functional value.


### Color system

Use semantic tokens shared between Figma and Compose. Electric lime is an accent for the primary action, selection, route line and a small number of data highlights. It is never the only way to communicate state. Status text also carries a label and icon. Do not use orange as the brand accent or warning color.

| Semantic token | Dark | Light |
| --- | --- | --- |
| background | #11140D | #F6F8F1 |
| surface | #1C2118 | #FFFFFF |
| surfaceRaised | #293123 | #EDF2E5 |
| textPrimary | #F4F7EE | #17200E |
| textSecondary | #BBC5B0 | #52604A |
| borderStrong | #7A866F | #74816A |
| primaryFill | #D2F56A | #D2F56A |
| onPrimary | #17200E | #17200E |
| accentText | #D2F56A | #365200 |
| successText | #B9E884 | #365200 |
| warningText | #F2D572 | #6B5500 |
| errorText | #FF9AA5 | #9A1F37 |

Primary buttons use dark text on lime in both themes. Lime text is reserved for dark surfaces; the light theme uses accentText instead. Critical control boundaries use borderStrong; decorative separators may be lower contrast but cannot be the only sign of interactivity. Selected chart series and map routes use a darker green treatment on light backgrounds with a contrasting casing when needed.


### Contrast and state behavior

Require at least 4.5:1 for normal text, 3:1 for large text and meaningful graphical/control boundaries. Verify the actual composite background for text over photos or maps. Disabled controls remain labeled and explain why they are unavailable; they must not look like actionable primary buttons. Transparent share previews can switch between light, dark and checkerboard backgrounds without changing export alpha.


### Theme behavior

Start in Dark on first launch and offer Dark, Light and System settings. Persist the explicit selection. Never infer outdoor visibility from ambient sensors in release one; the runner can choose Light before recording. Both themes receive equal functional testing even though Dark leads the visual presentation. Blur is optional polish and must not be required for hierarchy or legibility.


### Typography and layout tokens

Bundle Roboto from its official upstream release, retaining the license shipped with the selected files. Use the same family in Figma and exports. The report template itself retains its own typography. Avoid SF Pro as an Android app dependency and avoid relying on the phone manufacturer's font setting for the intended visual identity. Honor Android font scaling and fallback glyph coverage. [S28]

| Role | Size and line height | Weight and treatment |
| --- | --- | --- |
| Live primary value | 56 / 62 sp | Bold; tabular numerals; units placed separately |
| Large metric | 40 / 46 sp | Semibold; tabular numerals |
| Page title | 28 / 34 sp | Semibold; letter spacing -0.3 sp |
| Section title | 20 / 26 sp | Semibold; natural case |
| Body | 16 / 24 sp | Regular; normal tracking |
| Button and strong label | 16 / 20 sp | Medium; sentence case |
| Supporting text | 14 / 20 sp | Regular or medium |
| Caption and chart label | 12 / 16 sp | Medium; limited to secondary metadata |

Use dp for geometry and sp for text. At 200 percent text size, switch metric grids to stacked rows and allow buttons to grow vertically. Do not clamp essential values into fixed-height boxes or shrink type to fit. Timer numerals keep their width stable; unit labels are smaller but never ambiguous. Use 6:20 /km, 5.24 km and 00:32:10 consistently with the metric definitions in the architecture report.

| Token group | Values | Application |
| --- | --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48 dp | 4 dp base; 24 dp default side inset; 16 dp on compact screens |
| Corner radius | 8, 16, 24 dp and fully rounded | 8 for compact fields; 16 cards; 24 sheets; round status pills sparingly |
| Controls | 48 dp minimum target; 56 dp primary action | Record controls at least 64 dp; finish action separated from pause |
| Icons | 20 or 24 dp; 2 dp stroke at 24 dp | Consistent Lucide vector assets, not mixed icon sets |
| Content width | Fluid phone layout; 600 dp max text column | Design baseline at 360 by 800 dp; also validate 320 dp width |
| Elevation | Flat base; subtle raised sheet/dialog | Use surface tone and scrim before heavy shadows |


### Components icons and motion

| Component | Required variants and states |
| --- | --- |
| Button | Primary, secondary, text, destructive; default, pressed, disabled and busy |
| Metric | Large/live/inline; available, acquiring, estimated, missing and low-quality |
| Workout row | Planned, completed, skipped, pinned, edited and conflict |
| Recorder control | Start, pause, resume, finish; GPS ready/weak/lost and interrupted |
| Coach proposal | Before/after rows, reason, input coverage, selected change and stale proposal |
| Map panel | Online, downloading, offline ready, missing resources and route-only canvas |
| Share template | Selected/unselected; transparent/photo/solid; optional route and fields |
| Form field | Default, focused, invalid, disabled; inline error and helper text |
| Feedback | Inline status, snackbar with Undo, destructive dialog and permission explanation |

Use Lucide icons for CalendarDays, CirclePlay, Pause, Map, Route, ChartNoAxesCombined, Settings, Share2, Download, Shield, Footprints and ChevronRight where available in the pinned set. Import the original SVGs as editable vectors in Figma and Android vector assets. Honor the upstream ISC license. Icons supplement visible labels; icon-only controls need content descriptions. Do not reproduce Strava logos or its custom symbols. [S27]


### Motion specification

| Interaction | Behavior |
| --- | --- |
| Press feedback | Immediate tonal response or ripple; optional 0.98 scale settling in 100 ms; do not delay command execution |
| Navigation | Native Android transitions; 180-220 ms for occasional screen changes; no staged dashboard entrance |
| Sheet drag | Track the finger directly; interruptible spring; no decorative bounce on simple taps |
| State swap | 120-160 ms opacity change; numeric recording values update without counting animations |
| Reduced motion | Respect the system animator setting; use static or short crossfades, remove scale/slide and chart drawing effects |
| Haptics | One meaningful cue on start/pause, completed interval, save or error; configurable; no constant pulses |

Apply Apple and Emil principles as native interaction requirements: instant response, stable spatial origins, reversible transitions and restrained animation. Do not transplant CSS, web hover behavior or unsupported spring assumptions into Compose. Avoid heavy live blur on the A54. Prototype gestures on the actual phone before treating timing values as final.


### Recording and activity experience


### Prepare and record

Record opens a pre-run view with GPS status, optional selected workout, route and cue settings. Acquiring is a visible state, not a frozen Start button. If precise location is unavailable, explain the limitation and offer permission/settings actions. Permit starting a timer-only session only after an explicit choice; distance and pace remain unavailable until accepted fixes arrive.

During recording, prioritize active time, distance and average pace, with the current workout step and remaining time or distance below. Provide a metric view and map view toggle. Use Pause as the dominant action and a clearly separated Finish action on the paused screen. Finish opens a short Save run review; accidental navigation preserves the session. GPS loss leaves the timer visible, flags the gap and does not fabricate movement.


### Recovery and post run

On relaunch after interruption, show the last saved duration and checkpoint time, then Resume as new segment, Save partial run or Discard. Discard asks for confirmation; an interrupted session is not silently erased. After saving, collect session effort, fatigue and discomfort in a compact sheet. Skip is visible. Missing answers stay missing and cannot count as positive coaching evidence.


### Activity detail and progress

Activity detail presents a title, local date, route preview and three primary metrics, followed by splits, quality notes, workout comparison and notes. Share and Export are explicit actions. History supports date and workout-type filters. Weekly charts show minutes or distance with accessible labels and a text summary. A missing measurement is displayed as an em dash with an explanation, not a zero. Any personal best is provisional until the run meets quality and continuity rules.


### Common states

| State | Content and next action |
| --- | --- |
| Empty history | Record your first run; no fabricated sample history in the real app |
| Low-quality route | Explain the affected metrics and keep the raw activity available |
| Storage error | Recording could not be saved; show last committed state and recovery actions |
| No internet | Recording remains available; show map download/availability state |
| Large text | Stack metrics; preserve controls and scroll access |
| Calendar denied | Plan remains usable; offer connection later or ICS export |


### Training calendar and map experience


### Generate and edit a program

The setup flow asks for goal, current comfortable duration, recent training, available days and session budgets. Show a plan preview with total weekly time and effort labels before activation. If the date or goal cannot fit the selected constraints, offer a later date or base-building goal. Do not hide the manual builder behind generated programs. Editing a workout opens steps, repeats, targets and a Pin this workout control.


### Review an adaptation

Today and Plan show a compact pending-change entry. The review screen lists exactly which future workouts change, before/after duration, the triggering rule, and relevant feedback coverage. Use explanations such as Keep this week unchanged because two easy runs felt harder than planned. Offer Accept selected, Keep current plan and View history. Accepting updates the in-app plan immediately and shows each calendar event as pending, synced or conflicted. Undo never rewrites completed workouts.


### Calendar and maps

Connect calendar is an optional setup action. Let the runner select a writable calendar, preview the events and choose a reminder. Calendar conflicts receive a direct choice between keeping the calendar time and using the app schedule. Show these conflicts in Plan, not in a separate technical sync screen.

Maps opens the saved routes list and a large map region. Keep current-location, compass and layer controls in consistent positions with 48 dp targets. Use an accessible contrasting route casing. The saved route panel shows distance, source activity and offline status. Explore popular routes opens the external heatmap and labels the destination. Personal heatmap appears in the following release as a separate layer labeled Your activity frequency; it is never confused with population popularity.


### Following release screens

Personal heatmap gets date filters and a relative-intensity legend. GPX import gets a preview list with new, duplicate and invalid states, followed by a reviewed save action. Shoes gets add/edit/retire and mileage history; a retired shoe remains in historical runs. These screens reuse existing map, row, form and confirmation components.


### Share Activity composer

Use the supplied examples as behavioral references: a large preview, template selection and explicit share actions. Give the app its own type hierarchy, lime route treatment and optional branding. All templates and options are available without a subscription. The composer is a full-screen task because route visibility, transparency and field selection need room to inspect.

| Area | Specification |
| --- | --- |
| Template picker | Four templates: Route plus stats, Stats only, Receipt and Photo plus stats. Horizontal swipe with named selection and accessible Previous/Next actions. |
| Data selection | Distance, active duration and average pace selected by default. Title, date and route are optional. Other metrics only appear when actually recorded. |
| Appearance | Foreground choices lime, white and dark; background transparent, solid or selected photo. Preserve independent foreground and background controls. |
| Privacy | Route hidden/trimmed/full; 200 m endpoint trim default. Date and location names off unless chosen. Preview the exact exported derivative. |
| Export sizes | Story 1080 by 1920, Square 1080 by 1080, Portrait 1080 by 1350. Use a 72 px outer safe inset; keep story content clear of the top/bottom 250 px as a layout default, not a platform guarantee. |
| Actions | Save image and Share. Android selects installed destinations. No public activity link, automatic posting or destination login is needed. |
| Transparency | Checkerboard is preview-only; PNG alpha outside content remains zero. Offer dark/light preview backgrounds for contrast checking. |
| Photo layout | Use the system picker and crop within the chosen aspect ratio. Add a user-adjustable solid scrim only in the photo variant when needed for legibility. |

Reflow selected fields rather than leave empty slots. Long titles wrap to at most two lines, then use an editable shortened title for export; never silently truncate the stored activity title. If no data and no route are selected, disable export with Choose at least one item. When the route trim removes all geometry, show a stats-only preview. Source-photo EXIF and unselected fields do not appear in exported metadata.

Receiving apps may flatten transparency or accept images differently. Verify Save and native sharing on the actual installed apps; the saved original PNG is the reference artifact. A dedicated Instagram Stories sticker integration can be investigated later, without making the first-release sharing flow depend on Meta developer registration.


### Accessibility and Figma handoff


### Accessibility acceptance

- TalkBack order follows the visual task sequence. A metric is announced as one meaningful unit, for example Distance five point two kilometers, rather than disconnected values and units.
- All controls have 48 dp targets; running controls are larger. Charts expose a text summary and data list. State is communicated with labels and icons as well as color.
- Support 200 percent font scale, system reduced motion, dark/light themes, keyboard focus and switch access. Validate 320 dp compact layouts and the A54 at its configured display size.
- Avoid repeated screen-reader announcements for every GPS sample. Announce significant state changes and interval cues; the runner can query live values on demand.

### Editable Figma deliverable specification

Create a new project file for the app rather than editing reference authors' files. Pages: 00 Brief, 01 Foundations, 02 Components, 03 Core flows, 04 Light theme, 05 Sharing, 06 Edge states and 07 Handoff. Create local components and semantic variables if no suitable published library is available. Inspect any existing library and Code Connect mappings before creating replacements.

Use auto layout, color modes, named Roboto text styles, component variants and editable SVG vectors. Repeated workout rows, metric groups and share templates must be componentized. No complete-screen screenshot may stand in for editable screen layers. Reference imagery stays outside deliverable screen hierarchies. Verify actual font family, clipping, layout bounds and full-frame screenshots after composition.

Prototype flows: first run; pause and finish; interrupted recovery; generated plan; adaptation review and undo; calendar conflict; saved-route following; share customization; backup restore. Annotate state ownership, content rules, spacing tokens, accessibility labels and export differences. The product app name and logo remain provisional; use Running Tracker as working text without inventing a brand launch.


### Design review and implementation order

Review outdoors on the A54, with large text and TalkBack. Prove recorder reliability before polishing screens. Build one complete feature flow, compare it with Figma, and document observed results before expanding.


## Appendix


### Content and screen inventory

Required screen families: onboarding and permissions; Today; program setup and preview; manual workout editor; weekly Plan; adaptation review and history; calendar selection/conflict; pre-run, recording, paused, finish and interrupted states; post-run check-in; activity list/detail/splits; Maps and saved-route/download panels; Progress charts; Share composer; Settings; backup and restore preview. Following-release families: personal heatmap, import review and shoes. Avoid producing every possible state as a separate artboard when component variants can describe it clearly.


### Measurement and research limits

No live application or editable Figma prototype is delivered by this documentation phase. The screen concepts use illustrative data. The supplied screenshots are reference material, not reusable product assets. The Figma Community reference needs visual inspection in the design stage; exact source tokens have not been asserted. Contrast checks validate the specified color pairs mathematically; outdoor readability, motion and receiving-app behavior still require device testing.


### Sources and reference material

S1  Android architecture recommendations. https://developer.android.com/topic/architecture/recommendations  Research baseline: 24 October 2026.

S6  MapLibre Native. https://maplibre.org/projects/native/  Research baseline: 24 October 2026.

S7  OpenFreeMap service and attribution. https://openfreemap.org/  Research baseline: 24 October 2026.

S8  OpenFreeMap mobile and offline download policy. https://openfreemap.org/quick_start/  Research baseline: 24 October 2026.

S9  Android Calendar Provider. https://developer.android.com/identity/providers/calendar-provider  Research baseline: 24 October 2026.

S10  Android sharing. https://developer.android.com/develop/ui/compose/sharing/send  Research baseline: 24 October 2026.

S11  Android TextToSpeech. https://developer.android.com/reference/android/speech/tts/TextToSpeech  Research baseline: 24 October 2026.

S27  Lucide icon license. https://github.com/lucide-icons/lucide/blob/main/LICENSE  Research baseline: 24 October 2026.

S28  Roboto typeface and upstream license. https://github.com/google/fonts/tree/main/ofl/roboto  Research baseline: 24 October 2026.

S29  User supplied Figma Community reference. https://www.figma.com/community/file/1328586164766653621/fitness-app-darkmode-minimalism  Research baseline: 24 October 2026.

User-supplied references: Strava screenshot archive and two Share Activity examples, reviewed in the planning conversation. Personal reference images are retained locally and are not published in the portfolio repository. Interaction principles also draw on the user-selected Apple Design and Emil Design Engineering skills.
