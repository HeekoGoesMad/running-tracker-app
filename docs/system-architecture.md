# Running Tracker App System Architecture

Planning baseline: 24 October 2026. Status: proposed, not implemented.


## 1  Abstract

Build a personal Android running application using Kotlin and Jetpack Compose. The application records runs with the screen locked, stores activities locally, generates and adapts training plans through explicit rules, guides workouts, displays saved routes, schedules calendar events, and exports customizable share images. The target validation device is a Samsung Galaxy A54. This is a proposed architecture and delivery plan; no application implementation or field validation is claimed.

The cost boundary is zero additional spending using the existing phone and development computer. The core has no account, hosted backend, paid API, generative AI, subscription, advertisements, or paywall. Maps use MapLibre Native and OpenFreeMap. Free Strava support is a GPX export followed by a manual website upload; automatic API uploads are excluded because current developer registration requires a Strava subscription. [S6-S8, S12-S13]


### Success criteria

- Complete a start, locked-screen recording, pause, finish, review, coach proposal, calendar update, backup and share-image flow on the target phone.
- Persist recording checkpoints at most five seconds apart while storage is healthy; restore the last committed draft after an unexpected exit without inventing missing route data.
- Recording, history, calculations, plans and image exports operate without internet. A map background is available only when online or its required resources have been downloaded.
- Every accepted plan revision is traceable and reversible. No algorithm may claim to predict injury, diagnose illness or guarantee race improvement.

## 2  Goals and Non Goals

| Included in the first release | Excluded from the first release |
| --- | --- |
| GPS recording, recovery, manual pause, splits and activity history | Social feeds, followers, messaging, public profiles and leaderboards |
| Generated plans, manual builder, guided steps and reviewed adaptations | LLMs, AI subscriptions, medical advice and automated injury-risk scores |
| Saved-route following and external population heatmap access | Waypoint route calculation, turn-by-turn navigation and embedded population heatmaps |
| Calendar scheduling, backup and customizable transparent PNG sharing | Hosted accounts, cloud database, automatic Strava upload and public activity URLs |
| Dark and light themes; data-quality and privacy controls | Store publication fees, paid build services and paid map tiers |


### Following release

Personal heatmaps, GPX history import and shoe mileage tracking are committed roadmap items for the following release. Health Connect, weather and route calculation are evaluated extensions, not requirements for either release. The architecture reserves clean adapters without prebuilding unused integrations.


### Defaults and boundary decisions

Use English UI text, kilometers, minutes per kilometer and meters by default, with selectable miles and pace units. Store timestamps in UTC plus the activity timezone; group workouts by their saved local date. A training week starts Monday. These are editable application preferences, not facts inferred about the runner. First-release generated goals are consistency, complete 5K, complete 10K, improve 5K and improve 10K. Half-marathon and marathon generation require a separate reviewed template set.


## 3  Background and Problem Statement

The project begins without an app codebase. The supplied Strava screenshots inform information hierarchy, live statistics, route summaries and sharing patterns. The supplied Figma Community file is a direction reference for restrained dark fitness design. The resulting product uses an original charcoal and electric-lime identity. Personal screenshots, activity traces and reference archives are excluded from the public portfolio repository.


### Architecture decisions

| Decision | Selected approach | Reason |
| --- | --- | --- |
| Client framework | Kotlin, Jetpack Compose, Material 3 foundations | One Android target; direct access to recording, files and calendars. Android recommends Compose and layered state ownership. [S1] |
| Backend | On-device repositories and domain services | No hosted server, accounts or ongoing service bill. |
| Persistence | Room over SQLite; DataStore for preferences | Transactional relationships, migrations and reactive queries; preferences stay separate. [S2] |
| Application shape | One app module with feature packages; one pure Kotlin coach module | Keep build complexity low while isolating the algorithm for reproducible tests. |
| Map integration | MapLibre Native MapView hosted in Compose AndroidView | Use stable native SDK lifecycle ownership; avoid relying on an evolving Compose wrapper. |
| Build and distribution | Android Studio, local Gradle builds and signed APK sideload | Use existing hardware. Keep the signing key private and backed up; no store account required for this distribution plan. |

Pin compatible stable dependency versions and the Compose BOM when the project is bootstrapped. Commit the version catalog and Gradle wrapper. This documentation deliberately does not present unverified future version numbers as a tested build combination.


## 4  Proposed Architecture

![Figure 1  Local application boundary and platform adapters](assets/architecture.png)

| Component | Responsibility | Storage | Failure behavior |
| --- | --- | --- | --- |
| UI and ViewModels | Expose immutable StateFlow screen states; accept user actions | SavedStateHandle for navigation drafts only | Recreate from repositories; never own the recording timer |
| Recording service | Own session lifecycle, location subscription, workout cues and checkpoints | Room activity, segments, points, workout cursor | Preserve committed data; expose interruptions and storage errors |
| Metrics engine | Filter samples and compute consistent durations, distance and splits | Derived metric version and quality flags | Unknown values remain unavailable; no fabricated zero measurements |
| Adaptive Coach | Generate plan drafts and versioned adaptation proposals | Coach module plus Room snapshots | Hold progression on missing inputs; no network fallback |
| Map and file adapters | Show routes, download bounded map areas, render PNG and GPX | Private cache and user-selected output files | Map failure cannot stop recording or corrupt completed runs |
| Calendar adapter | Create and update only linked workout events | Calendar event link and last-published payload | Queue a pending update; reconcile after calendar/provider recovery |


### State ownership and dependencies

Compose screens observe ViewModels. ViewModels call repositories and use cases. Repositories own Room, file storage and platform adapters. The coach module accepts immutable snapshots and returns proposals; it has no Android, database, network or clock dependency. Supply the current date explicitly. Use constructor injection with a small AppContainer; add a DI framework only if complexity later justifies it.

Feature packages: today, recording, activity, training, maps, progress, sharing and settings. Shared packages: data, metrics, calendar, export and designsystem. Domain calculations run off the main thread. WorkManager handles deferrable reconciliation and reminders, never continuous GPS capture. Charts use a small local Compose Canvas implementation for weekly totals and pace trends.


## 5  Request Lifecycle


### Record and recover a run

From a visible screen, request precise foreground location and start a location foreground service after permissions and system location are available. Request notification permission contextually; its denial does not itself disable recording, but removes notification-drawer controls. Declare the required service type and permissions. Do not request all-the-time location in the first release. [S3-S5]

Use the state machine idle > acquiring > recording <-> paused > finalizing > completed. Unexpected termination leaves a persisted recording or paused draft; on launch classify it as interrupted. Start, pause, resume and finish write immediate state transitions. A single writer serializes actions and GPS batches; the UI observes committed state. Use monotonic elapsed time within a boot and UTC instants for export. Across reboot, finish the old segment and require an explicit resume into a new segment.

Request high-accuracy locations about every second during an active segment, accepting that Android does not guarantee that delivery frequency. Batch commits no more than five seconds apart while storage is healthy. Pause stops route accumulation and workout step time. Resume always starts a new segment. Finishing is idempotent and computes final metrics in a transaction before calendar reconciliation, GPX or PNG export is offered.


### GPS acceptance and metric definitions

| Metric or rule | First-release definition |
| --- | --- |
| Candidate fix | Keep raw fixes with timestamp, accuracy, coordinates and segment ID; metric acceptance requires finite valid coordinates, increasing monotonic timestamp, age at most 10 seconds and horizontal accuracy at most 30 meters. |
| Discontinuity | Start a gap after 15 seconds without an accepted fix, after pause or after service recovery. Do not add a straight line across gaps. Flag implied speed above 10 meters/second for review; do not turn it into a record. |
| Elapsed time | Finish instant minus start instant; includes user pauses and interruptions. |
| Active time | Sum of active recording segment durations; excludes explicit pauses and interruptions. Do not label it moving time. Auto-pause is deferred. |
| Distance and pace | Distance is geodesic sum of accepted within-segment pairs. Average pace is active time divided by valid distance. GPS gaps make this estimate incomplete and visibly flagged. |
| Splits | Interpolate a kilometer boundary only between consecutive accepted points in one continuous segment. Partial and gap-affected splits are labeled. |
| Data coverage | Measure seconds covered by accepted, continuous position pairs divided by active seconds. Below 80 percent, mark the activity low quality and exclude automatic performance progression and records. |
| Unavailable metrics | No heart rate, calories, steps or elevation gain unless a validated source supplies them. Display unavailable, not zero. |

The numeric quality thresholds above are initial engineering defaults and must be evaluated against replay fixtures and outdoor A54 runs. Preserve raw samples so a future metric version can recompute results without rewriting the original capture. The phone is not a surveyed distance reference.


### Guided workouts

Represent warm-up, work, recovery, repeats and cool-down as ordered steps with a duration or distance boundary and an effort target. Persist the current step and progress with each checkpoint. A pause freezes the step clock. Emit one cue per step transition using a durable transition key; use an installed offline voice when available, otherwise a tone and vibration. Distance steps suspend boundary advancement while location quality is insufficient; time steps continue with a visible GPS warning. [S11]


### Adaptive Coach generation and review

Use an original deterministic rule engine, not generative AI and not a copied proprietary coaching algorithm. Existing products and open-source projects show the feasibility of explicit adaptation; their existence does not validate this implementation. Session load uses active minutes multiplied by the runner's session effort rating from 1 to 10, in arbitrary units. This is a workload descriptor, not a fitness diagnosis. [S20-S26]


### Required inputs and initial plan

Onboarding collects goal, available weekdays, preferred time window, maximum session duration, current comfortable run or run-walk duration, recent weekly minutes, and longest recent comfortable session. Use up to four weeks of reliable local history when available, with the user confirming the baseline. Missing baseline information blocks generated progression, not manual recording or the manual builder.

Generate a rolling four-week plan with a 14-day calibration period when reliable history is insufficient. Use only the selected days and time budgets. Initial weeks do not exceed the confirmed recent weekly minutes or comfortable session duration. Users with no recent routine receive an editable run-walk calibration draft bounded by their stated comfortable duration; do not infer a training dose from age or phone metrics. For a dated 5K or 10K goal, offer an eight-week template only when the user can already comfortably run or run-walk at least 15 minutes on three available days. Otherwise offer base building and a later date. These eligibility rules are product heuristics, not clinical cutoffs.


### Versioned policy v1

| Decision | Explicit first-release behavior |
| --- | --- |
| Readiness input | After each run collect effort 1-10, fatigue 1-5 and discomfort none/mild/moderate/severe. Allow skipping; missing feedback cannot count as good recovery. |
| Hold conditions | Any moderate/severe discomfort, fatigue 4-5, low-quality activity, or fewer than six valid runs across 14 days prevents progression. Show the specific missing or limiting input. Discomfort suspends coaching progression and invites rest/review; it does not produce a diagnosis. |
| Completion | For each planned session linked to one completed run, use min(actual active minutes / planned minutes, 1). Weekly adherence is completed planned minutes divided by scheduled minutes. Skipped sessions contribute zero, not extra work owed. |
| Progression | Only after two consecutive review weeks with at least 80 percent adherence, at least 80 percent effort-feedback coverage and no hold conditions: propose adding min(5 percent of weekly minutes, 5 minutes), rounded down to whole minutes. Add only easy running time. |
| Volume and intensity | Never increase frequency, volume and intensity in the same adaptation. First-release adaptation changes easy duration only; it does not infer a faster pace target from one fast run. |
| Hard sessions | Generated speed-goal plans may contain at most one quality session per week only after four active weeks of reliable baseline history and three scheduled weekly runs. Place no quality session adjacent to a long or another quality run. Otherwise generate easy/run-walk and long sessions only. |
| Recovery and missed time | Every fourth generated week proposes 15 percent less planned time. Two consecutive weeks below 50 percent adherence return the plan to a reviewed calibration draft. Never double a session to catch up. |
| Single-session growth | Flag a proposed distance above 110 percent of the longest reliable session in 30 days and require manual review; this is a review trigger informed by observational research, not a safe-distance guarantee. [S23] |
| Manual protection | Pinned or manually edited workouts are not changed. If a proposal cannot fit available days and recovery spacing, report a conflict instead of silently moving protected workouts. |

All percentages and eligibility thresholds in policy v1 are transparent engineering defaults. The literature does not establish a universal safe weekly progression. Keep the rules configurable in versioned code, record every rule ID and input snapshot, and validate behavior through simulation and personal field observation before enabling progression proposals. No guaranteed injury reduction or race outcome is asserted. [S22-S23]


### Deterministic template construction

The runner selects one to five recurring training days; sort them by weekday and preserve the chosen time window. Use the confirmed weekly time as the initial budget and reserve the final preferred training day for the long easy session. Allocate at most 40 percent to that session and split remaining minutes equally across the other days, rounding down to whole minutes. Cap every session by its user time budget and the confirmed comfortable duration; leave unallocated time unused instead of increasing another session beyond its cap. With one available day, use one easy session; two days use easy sessions only. These allocations are engineering defaults. A pinned schedule that cannot satisfy spacing yields a conflict rather than a hidden schedule change.

During calibration, use the runner-selected continuous or run-walk mode. Run-walk steps repeat 1 minute easy running and 1 minute walking, with a final partial step if needed, within the confirmed comfortable duration. Easy and long sessions target perceived effort 2-4. Where eligible, replace one ordinary easy session with one quality session, keeping the weekly minute budget unchanged: alternate 10 minutes easy plus 4 repeats of 1 minute at effort 7 and 2 minutes easy plus 5 minutes cool-down (27 minutes total), and 10 minutes easy plus 2 repeats of 5 minutes at effort 6 with 3 minutes easy between repeats plus 5 minutes cool-down (28 minutes total). If the assigned session budget is shorter, retain the easy session; do not compress recovery intervals.

An eight-week goal calendar repeats the four-week generation cycle; weekly adaptation is still the only source of workload increases. Week 7 caps training minutes at 80 percent of week 6 and week 8 at 60 percent, with no quality session in the final three days. A goal event is a separate scheduled entry, not a guarantee of completing the distance or a source of extra training load before it occurs. Do not generate pace targets or predicted finish times without a separately reviewed pace model. Manual programs can define pace targets directly. Round and cap deterministically, breaking equal-duration allocation ties by earlier selected weekday.


### Review and application

Recompute summaries after a finalized activity or check-in edit; produce the weekly adaptation when opening Plan after a week closes. Return draft changes with before/after values, rule IDs, reasons and a base plan revision. The runner accepts all, accepts selected compatible changes, or rejects. Apply accepted changes only to future workouts in one Room transaction. A stale base revision invalidates the proposal and requires recomputation. Undo creates a new revision restoring only still-future changes; completed workouts stay immutable.


### Calendar maps and export lifecycles


### Calendar scheduling

The app is authoritative for training plans. On first calendar connection, request READ_CALENDAR and WRITE_CALENDAR, let the runner select one existing writable calendar, and preview publication. The calendar account's own sync adapter handles any Google or Samsung synchronization; no Google Calendar OAuth backend is added. Calendar permission denial leaves the in-app plan fully usable. [S9]

Persist a CalendarEventLink for every published workout and place an app-owned workout UUID marker in its description. Publish accepted plan changes through an outbox; create/update linked events only. Store the last-published start, end and title. If an event was externally changed, show Keep calendar time or Use app schedule before overwriting. If a linked event was deleted externally, require an explicit republish. Never overwrite unrelated entries. The calendar app owns its event reminders; in-app reminders are best-effort and not an alarm guarantee.


### Map viewing and route following

Use OpenFreeMap styles with MapLibre Native, showing required attribution. Store favorites as route geometry derived from completed activities. Draw the selected route and current position; no routing request is needed. Off-route guidance is a visual distance-to-line indicator after sustained reliable samples; it must not claim turn-by-turn or road safety. The external population heatmap opens in the browser and is not represented as an embedded API. [S6-S8, S15]

Allow one small downloadable map area per saved route, enforcing both 3000 tiles and 50 MB maximum per download, at most four simultaneous requests, and a unique app User-Agent. Check all source resources, including style, sprites and glyphs, before reporting Offline ready. If limits cannot be met, reduce bounds or zoom. An unavailable background still shows the recorded route on a neutral canvas. [S8]


### Sharing and Strava

Share templates are route plus stats, stats only, compact receipt and photo plus stats. The runner selects fields, foreground color, optional branding and background. Export PNG with alpha at 1080 by 1920, 1080 by 1080 or 1080 by 1350 pixels. A checkerboard exists only in the preview. Use local rendering with Android Canvas; a route-only design uses no map tiles. Map-background exports retain attribution. Android Photo Picker selects a user photo; strip source metadata from the rendered image. [S10]

Default image sharing hides 200 meters from both route endpoints; if trimming removes the route, switch to a stats-only preview. Offer full route or route hidden controls, and explain that totals still describe the whole activity. Apply trims to an export copy, not the original. Remove location/date fields unless selected. Use FileProvider with temporary URI access for sharing, and MediaStore for Save image. Clipboard image copying is a secondary action only where compatible; native sharing and saving are the dependable first-release paths.

For Strava, create a timestamped GPX 1.1 track from accepted points and continuous segments. The export preview explicitly distinguishes the complete private route from a privacy-trimmed copy. The default Strava export includes the complete route only after the runner selects it and reviews the disclosure. Open the Strava file uploader and let the runner select the exported file; never scrape sessions or request a password. Upload success is confirmed by Strava, not inferred from opening its page. [S12-S13]


## 6  API and Data Contracts


### Local interfaces

| Interface | Input | Output and contract |
| --- | --- | --- |
| Recorder.start / pause / resume / finish | Command UUID, session ID, expected state version | Committed RecordingState; repeated command IDs have no duplicate effect. |
| ActivityRepository.observe / finalize | Activity UUID; metric version | Flow of ActivityDetail; finalization is transactional. |
| Coach.generate | TrainingProfile, HistorySnapshot, explicit local date, policy version | PlanDraft with validation findings; no side effects. |
| Coach.propose / apply / undo | Plan revision, immutable snapshot, selected change IDs | AdaptationProposal or new revision; stale versions fail explicitly. |
| Calendar.publish | Accepted plan revision and workout IDs | Per-workout synced/pending/conflict status; never an entire-calendar replacement. |
| Export.render / exportGpx | Activity ID, ShareSpec or GpxExportSpec | Local content URI plus metadata; no network publication. |
| Backup.create / validate / restore | Destination URI or selected archive | Manifest and validation report; restore requires preview and pre-restore backup. |

These are internal Kotlin contracts, not HTTP endpoints. Expose typed success, validation, permission, storage, conflict and unavailable results. Public wire formats are GPX 1.1, PNG and versioned backup JSON; do not expose a local web server. Store numeric values in SI units and convert only at presentation/export boundaries.


### Persistent records

| Record | Important fields | Relationship or invariant |
| --- | --- | --- |
| Activity | UUID, source, status, UTC times, timezone, active/elapsed ms, distance m, quality, metricVersion | One saved activity per recording; imported activity source retained. |
| TrackSegment and TrackPoint | Activity/segment UUID, monotonic time, UTC time, lat/lon, accuracy, accepted flag | Ordered points never bridge pauses or gaps; unique activity/segment/sequence. |
| Split | Activity UUID, index, distance, active ms, partial/gap flags | Rebuildable derived record. |
| TrainingProfile | Goal, available days, budgets, baseline, unit preferences | One personal profile; no account or authentication table. |
| Plan and PlanRevision | UUID, revision, policy version, generated date, accepted changes | Append revisions; keep a stable active revision pointer. |
| Workout and WorkoutStep | UUID, local date/timezone, duration/distance target, effort, repeats, pinned flag | Historical linked workouts remain stable when future schedules change. |
| CheckIn and AdaptationProposal | Effort/fatigue/discomfort, input snapshot hash, base revision, rule reasons | Missing feedback stays null; proposals cannot silently self-apply. |
| SavedRoute and MapDownload | Geometry copy, source activity, bounds, status, resource size | Deleting a source activity offers a choice to retain its saved route copy. |
| CalendarEventLink and Outbox | Workout UUID, calendar/event IDs, last payload, desired revision, retry state | One link per workout and selected calendar; provider IDs are device-specific. |
| SharePreset and BackupRecord | Template/fields/color/trim, version; manifest date/counts/checksums | Presets contain preferences; backups do not contain signing keys or tokens. |
| ImportFingerprint and Shoe | File hash/content fingerprint; shoe UUID/name/retirement/manual starting mileage | Following release: duplicate imports idempotent; mileage derived from linked activities. |

Room migrations are explicit and tested from every released schema. Never enable destructive migration fallback. Raw samples are retained until the runner deletes the activity; derived summaries can be recomputed. For initial sizing, a one-hour run at one fix per second has roughly 3600 points; measure actual database growth rather than promise a storage figure.


## 7  Consistency Idempotency and Replay

| Scenario | Required behavior | Verification |
| --- | --- | --- |
| Repeated finish or rapid pause taps | Serialize state transitions; command IDs prevent duplicate saved activities | Replay the same command twice and assert one transition. |
| Process death during a run | Read last committed checkpoint; mark interruption; explicit resume starts a new segment | Kill/reopen tests and monotonic clock reset fixtures. |
| Storage full or failed checkpoint | Stop presenting healthy recording; warn; preserve last successful data and offer recovery | Inject write errors before and after a committed point batch. |
| Coach recalculated after manual edit | Reject stale base revision; preserve pinned and completed workouts | Concurrent edit/proposal scenario. |
| Calendar insert succeeds before local acknowledgement | Find app UUID marker before retry; never create a second event | Simulate crash between provider insert and link commit. |
| Restore or repeated GPX import | Validate identity, version and hashes; import previews classify duplicates | Corrupt archive, unsupported version and reimport fixtures. |
| Metric algorithm upgrade | Keep raw points; rebuild derived metrics with a new version | Golden traces checked against independent calculations. |


### Backup and restoration

A backup is a ZIP containing manifest.json, normalized JSON records and optional user photos, with schemaVersion, createdAt, record counts and SHA-256 checksums. Do not copy a live SQLite database file without a consistent snapshot; use a repository snapshot transaction and serialize records. Use Android Storage Access Framework so the runner can choose local storage or an already-configured document provider without app-specific cloud integration.

Validate path traversal, archive expansion size (maximum 500 MB initially), entry types, counts, hashes, IDs and supported schema before presenting a restore summary. Restore is replacement, not merge, in release one. Create a pre-restore backup; load into a staging database, validate constraints and swap only after success. Restore calendar links as disconnected and offer a deduplicated re-link preview, because calendar IDs differ across devices. Hide checkpoints and map caches from portable backups. Remind after seven days with unbacked-up changes; reminders are dismissible.


## 8  Security and Privacy Considerations

Use Android app-private storage and device security for local records. No sign-in or custom password is needed for a one-user app. Exclude the sensitive database, raw tracks and check-ins from automatic platform cloud backup by default; use the explicit export path instead. Unencrypted exported backups contain precise routes and personal check-ins, so label their contents before saving and recommend a trusted destination. Password-encrypted portable backups are a separately reviewed extension, not a promised v1 capability.

Request location only when starting recording; calendar access only when connecting a calendar; photo access through the system picker. Keep diagnostics local, bounded and opt-in for export, with no coordinates, check-in answers or tokens in logs. Do not add advertising, analytics or crash-reporting SDKs that transmit activity data. Clear temporary share files after 24 hours or on explicit cache cleanup, but retain them long enough for receiving apps to read them.

PNG exports embed no GPS EXIF or private internal identifiers. GPX necessarily contains coordinates and timestamps; show those consequences. Original tracks, Strava screenshots, personal photos, databases, backup archives, calendar identifiers, local diagnostic logs, signing keys and credentials must never enter the public repository. Public diagrams and image concepts use illustrative values only.

Model metadata and file parsers treat imported content as data. Disable XML external entities/DTDs for GPX, enforce file size and point limits, reject non-finite coordinates, and never execute content from files. The following-release GPX importer accepts up to 25 MB and 100000 points per file initially, with a preview and per-file errors; these are configurable resource limits.


## 9  Operational Readiness

This is a personal app, so operational readiness means observable local behavior and reproducible release checks, not a hosted monitoring stack. Show recording status, checkpoint age, GPS quality, pending calendar changes, map availability and last backup time in relevant screens. Store a local diagnostics ring buffer of event codes and durations for at most seven days; purge on request.

| Acceptance target | Measurement | Release gate |
| --- | --- | --- |
| Recording durability | Healthy-storage checkpoint age no more than five seconds; all state changes committed immediately | Injected termination tests plus physical-device runs |
| Background recording | Three separate 60-minute outdoor sessions with screen locked and no unexplained recorder termination | Required before relying on the app as sole recorder |
| GPS quality | Replay known-distance fixtures within 1 percent of independent fixture calculations; separately compare outdoor traces without treating another app as ground truth | Required; document observed outdoor differences |
| Battery and responsiveness | Measure three comparable runs; investigate usage above 10 percentage points/hour; no persistent main-thread stalls in the core flow | Engineering target, not a measured claim |
| Coach correctness | All rule invariants, deterministic outputs, stale-revision protection and hold cases pass | Required before progression proposals are enabled |
| File and calendar integrity | All backup round-trips and duplicate publication scenarios pass | Required |
| Accessibility and export | TalkBack, 200 percent text, light/dark, all PNG sizes and alpha checked on target device | Required |

Use local Android instrumentation and focused unit tests. Add a public-repository CI workflow for lint, unit tests and debug assembly only after implementation exists, with no paid runners or secrets. Never describe unexecuted tests as passing. Keep APK signing and distribution manual on existing hardware initially.


### Risk register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| A54 process management interrupts recording | Lost route section | Early real-device spike, short durable checkpoints and explicit interrupted-session recovery |
| GPS errors influence coaching | Inappropriate progression | Quality gates, effort feedback and manual review; retain raw data |
| Rules have limited individual validity | Training advice may not suit the runner | Clearly marked heuristics, no injury prediction, configurable holds and reversible proposals |
| Free map service unavailable or policy changes | Missing basemap | Provider adapter, bounded offline areas and neutral route canvas |
| Calendar/provider unavailable or externally edited | Duplicate or conflicting workouts | Outbox, UUID markers, payload comparison and conflict UI |
| Phone loss or corrupt archive | Loss of history | Visible backup status, validation and tested staged restore |
| Receiving app flattens PNG alpha | Unexpected share appearance | Save original alpha PNG; preview and test installed share targets |


## 10  Alternatives Considered

| Alternative | Benefit | Decision |
| --- | --- | --- |
| React Native with Expo | Shared JavaScript stack and future iOS reuse | Not selected for a single Android target; native lifecycle control is central. Revisit only with a cross-platform requirement. |
| Flutter | Cross-platform rendering and strong UI toolkit | Not selected because there is no second platform and Android adapters are the primary integration work. |
| PWA | Simple distribution | Not selected for dependable locked-screen GPS requirements. |
| Hosted backend and cloud sync | Multi-device access | Excluded by local ownership and zero additional spending; manual backups meet the agreed need. |
| Generative AI coaching | Conversational recommendations | Replaced by explicit local rules; no model hosting, subscription integration or sensitive-data API path. |
| Automatic Strava API uploads | Convenient synchronization | Excluded for this free-Strava account because developer registration currently requires a subscription. [S12] |


### API selection and cost boundary

| Capability | Decision | Constraint |
| --- | --- | --- |
| Basemap | Use OpenFreeMap via MapLibre Native | Free public tiles; attribution and offline limits apply; no SLA. [S6-S8] |
| GPS/calendar/share/audio | Use Android platform APIs | No metered external service; permissions and device capabilities still apply. [S3-S5, S9-S11] |
| Population heatmap | Open the provider website externally | No supported free embedding verified. [S15] |
| Health Connect | Defer | Useful only with an actual source of compatible health records. [S16] |
| Open Meteo weather | Defer | Personal non-commercial free tier and attribution; does not determine coaching intensity. [S17] |
| openrouteservice | Defer | Free Standard key documented; routing is outside v1; recheck account quota before adding. [S18] |
| Google Calendar REST API | Defer | Device calendar avoids extra OAuth; documented service limits and pricing may change. [S19] |


## 11  Assumptions and Validation Items

The agreed product direction is complete enough for implementation planning. The remaining items below are validation gates with defined fallback behavior, not requests for another product interview.

- Confirm the installed Android version, free storage and actual RAM on the A54 during setup. If it cannot run the selected stable SDK combination, adjust min/target compatibility without changing the core feature contract.
- Validate locked-screen recording before building the full UI. If it fails on the device, keep an experimental recorder label and do not promote the app as the sole recorder until resolved.
- Validate a writable calendar account. If none is available or permission is denied, use the in-app calendar and an ICS export for manual calendar import.
- Validate offline voice availability. If no suitable voice exists, use bundled tones and vibration; do not silently send speech to a network voice.
- Review coaching fixtures and generated examples before enabling adaptations. Run a two-week observation-only period where proposals are visible but cannot auto-apply; manual acceptance remains required afterward.
- Recheck the map, Strava and calendar documentation before release because provider policies can change. The public portfolio states the research date and distinguishes proposals from measured results.

## 12  Decision and Next Steps

Implement the local Android architecture in thin vertical slices, with the recording reliability spike first. Create an editable Figma design system and a prototype before screen implementation, then refine it using the A54 recording constraints. The detailed task checklist is maintained in tasks/todo.md; tasks/plan.md provides the ordered dependency map. The documents and roadmap are the current deliverables; application code and the editable Figma prototype are subsequent implementation work.

| Milestone | Deliverable | Exit criteria |
| --- | --- | --- |
| M0  Device proof | Minimal recorder, permission flow and saved draft | Screen-lock and termination/recovery evidence on A54 |
| M1  Design foundation | Figma tokens, components and critical-flow prototype | Dark/light, large text, core states and editable layers reviewed |
| M2  Record and review | Activities, metrics, quality, map and local persistence | One complete recorded run survives restart and is inspectable |
| M3  Train and schedule | Manual programs, generator, guidance, adaptation review and calendar | Deterministic policy suite plus calendar conflict tests pass |
| M4  Protect and share | Backup/restore, PNG composer and GPX export | Round-trip restore, alpha export and manual Strava flow verified |
| M5  Personal release | Accessibility, battery, reliability and signed APK | Acceptance matrix completed with measured results |
| M6  Following release | Personal heatmap, GPX import and shoes | Deduplication, density weighting and mileage calculations verified |


### Implementation verification matrix

| Area | Required scenarios |
| --- | --- |
| Recorder | Denied/coarse location; location disabled; stale fixes; pause/resume; duplicate finish; screen lock; user stop; crash; reboot; storage full |
| Metrics | Stationary jitter; impossible spikes; missing segments; zero distance; boundary splits; UTC/local date changes; unit conversions |
| Coach | No history; missing effort; poor recovery; protected workout; missed week; repeated review; stale plan; deload; session budget conflict; undo |
| Calendar | Permission revoked; no writable calendar; DST; time-zone change; provider deletion; external edits; insert/acknowledgement crash |
| Exports | All field combinations; long titles; unavailable metrics; alpha channel; photo metadata; trim removes route; sharing cancelled |
| Backup and future import | Truncated/malicious ZIP; bad hash; unknown schema; failed staging restore; traversal GPX/ZIP; duplicate or unsupported files |


### Following release behavior

Personal heatmap intensity represents traversal frequency, not the number of GPS samples: resample each valid route at regular spatial intervals and count each spatial cell at most once per activity. Filter by date and keep the legend relative to the selected history. GPX import previews records and deduplicates by file SHA-256 plus a canonical timestamp/coordinate fingerprint; undated tracks can become saved routes but cannot influence training load. Shoe mileage equals an editable starting offset plus linked completed-run distance; retiring a shoe does not alter historical links.


### References

S1  Android architecture recommendations. https://developer.android.com/topic/architecture/recommendations  Research baseline: 24 October 2026.

S2  Room persistence library. https://developer.android.com/training/data-storage/room  Research baseline: 24 October 2026.

S3  Fused Location Provider client. https://developers.google.com/android/reference/com/google/android/gms/location/FusedLocationProviderClient  Research baseline: 24 October 2026.

S4  Foreground service types and location prerequisites. https://developer.android.com/develop/background-work/services/fgs/service-types  Research baseline: 24 October 2026.

S5  User stopping a foreground service. https://developer.android.com/develop/background-work/services/fgs/handle-user-stopping  Research baseline: 24 October 2026.

S6  MapLibre Native. https://maplibre.org/projects/native/  Research baseline: 24 October 2026.

S7  OpenFreeMap service and attribution. https://openfreemap.org/  Research baseline: 24 October 2026.

S8  OpenFreeMap mobile and offline download policy. https://openfreemap.org/quick_start/  Research baseline: 24 October 2026.

S9  Android Calendar Provider. https://developer.android.com/identity/providers/calendar-provider  Research baseline: 24 October 2026.

S10  Android sharing. https://developer.android.com/develop/ui/compose/sharing/send  Research baseline: 24 October 2026.

S11  Android TextToSpeech. https://developer.android.com/reference/android/speech/tts/TextToSpeech  Research baseline: 24 October 2026.

S12  Strava developer registration requirements. https://developers.strava.com/docs/getting-started/  Research baseline: 24 October 2026.

S13  Strava manual workout file upload. https://support.strava.com/en-us/articles/15402066-how-do-i-get-my-activities-to-strava  Research baseline: 24 October 2026.

S14  Strava API policy. https://www.strava.com/legal/api_policy  Research baseline: 24 October 2026.

S15  Strava response on Global Heatmap API. https://communityhub.strava.com/developers-api-7/global-heatmap-api-2100  Research baseline: 24 October 2026.

S16  Health Connect availability. https://developer.android.com/health-and-fitness/health-connect/availability  Research baseline: 24 October 2026.

S17  Open Meteo free service limits. https://open-meteo.com/en/pricing  Research baseline: 24 October 2026.

S18  openrouteservice account and free Standard key. https://openrouteservice.org/  Research baseline: 24 October 2026.

S19  Google Calendar API usage limits. https://developers.google.com/workspace/calendar/api/guides/quota  Research baseline: 24 October 2026.

S20  Foster et al 1996 training load study. https://pubmed.ncbi.nlm.nih.gov/8693756/  Research baseline: 24 October 2026.

S21  Foster et al 2001 session RPE method. https://pubmed.ncbi.nlm.nih.gov/11708692/  Research baseline: 24 October 2026.

S22  Running injury and training parameter evidence review. https://pmc.ncbi.nlm.nih.gov/articles/PMC9528699/  Research baseline: 24 October 2026.

S23  2025 single session distance cohort study. https://pubmed.ncbi.nlm.nih.gov/40623829/  Research baseline: 24 October 2026.

S24  Adapta product description of rule based adaptation. https://adapta.run/en  Research baseline: 24 October 2026.

S25  trainctl open source reference. https://github.com/dithiothreitol/trainctl  Research baseline: 24 October 2026.

S26  Polar Running Program documentation. https://support.polar.com/en/support/get_started_with_the_polar_running_program  Research baseline: 24 October 2026.
