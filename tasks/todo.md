# Implementation checklist

Planning baseline: 24 October 2026. All items below are future work.

Keep each implementation task to one focused feature slice and at most five handwritten files where practical; split it further before starting if that boundary is exceeded. Generated Android scaffolding is the exception.

## T01 Create the local Android foundation

- [ ] Complete T01.

**Description:** Deliver the app build configuration and application entry slice.
**Dependencies:** None.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Install a debug APK on the target phone.
- [ ] persist one local preference.
- [ ] isolate a pure Kotlin coach module.

**Verification:** Local Gradle assembly and device launch. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T02 Prove foreground recording

- [ ] Complete T02.

**Description:** Deliver the recording service and minimal recorder screen slice.
**Dependencies:** T01.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Start from a visible activity.
- [ ] collect and persist location batches.
- [ ] continue through screen lock with visible state.

**Verification:** Physical A54 outdoor capture plus denied/coarse-location scenarios. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T03 Prove interrupted session recovery

- [ ] Complete T03.

**Description:** Deliver the recording state repository and recovery screen slice.
**Dependencies:** T02.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Checkpoint within five seconds on healthy storage.
- [ ] recover a committed draft.
- [ ] resume into a new segment without bridging the gap.

**Verification:** Process termination, reboot and write-failure injection. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T03

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.

## T04 Create Figma tokens and components

- [ ] Complete T04.

**Description:** Deliver the editable Figma foundations and component pages slice.
**Dependencies:** T01.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Define dark/light semantic modes.
- [ ] create named text and spacing styles.
- [ ] componentize required states.

**Verification:** Layer/font audit, contrast checks and full-frame review. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T05 Prototype critical interactions

- [ ] Complete T05.

**Description:** Deliver the editable Figma core flows and state variants slice.
**Dependencies:** T03, T04.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Connect recording/recovery and plan review flows.
- [ ] show share/restore states.
- [ ] verify compact and large-text layouts.

**Verification:** Prototype walkthrough on the phone; record findings, not fabricated participant results. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T05

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.

## T06 Compute versioned run metrics

- [ ] Complete T06.

**Description:** Deliver the metrics engine and fixture tests slice.
**Dependencies:** T03.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Implement active/elapsed definitions.
- [ ] filter and segment points.
- [ ] compute distance, coverage and labeled splits.

**Verification:** Independent fixture calculations, jitter/gap/zero-distance and unit-conversion tests. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T07 Complete run review and check in

- [ ] Complete T07.

**Description:** Deliver the activity detail and check-in feature slice.
**Dependencies:** T05, T06.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Finalize one activity once.
- [ ] collect nullable effort/fatigue/discomfort.
- [ ] expose quality and splits.

**Verification:** Rapid finish taps, restart after save and skipped-feedback scenarios. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T08 Build history and progress views

- [ ] Complete T08.

**Description:** Deliver the history repository and progress screens slice.
**Dependencies:** T07.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Filter recorded activities.
- [ ] aggregate by saved local week.
- [ ] exclude low-quality records from performance comparisons.

**Verification:** Timezone/week-boundary and empty-state fixtures; accessible chart summary. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T09 Follow a saved route

- [ ] Complete T09.

**Description:** Deliver the map adapter and saved-route feature slice.
**Dependencies:** T05, T07.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Render attributed basemap and selected geometry.
- [ ] save a route copy.
- [ ] show current position and degraded map state.

**Verification:** Online/offline map failures cannot stop recorder; no false turn-by-turn claim. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T09

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.

## T10 Build manual programs

- [ ] Complete T10.

**Description:** Deliver the plan repository and workout editor slice.
**Dependencies:** T05, T07.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Create dated workouts and steps/repeats.
- [ ] pin manual edits.
- [ ] link a completed run to a planned workout.

**Verification:** Edit/restart/pin tests and invalid step/repeat input cases. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T11 Generate a constrained plan draft

- [ ] Complete T11.

**Description:** Deliver the pure Kotlin generator and plan preview slice.
**Dependencies:** T06, T10.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Require baseline and availability inputs.
- [ ] implement deterministic allocation/template rules.
- [ ] report impossible constraints.

**Verification:** Golden examples for 1-5 selected days, no history, short budgets and 5K/10K goals. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T12 Guide a scheduled workout

- [ ] Complete T12.

**Description:** Deliver the workout cursor and cue adapter slice.
**Dependencies:** T02, T10.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Advance time/distance steps.
- [ ] freeze progress on pause.
- [ ] emit one cue per transition with offline fallback.

**Verification:** Restart near a boundary; weak GPS; unavailable voice and repeated-cue tests. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T13 Propose explainable adaptations

- [ ] Complete T13.

**Description:** Deliver the coach policy and proposal model slice.
**Dependencies:** T07, T11.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Compute workload/adherence/feedback coverage.
- [ ] apply holds and progression caps.
- [ ] record rule IDs and input snapshot.

**Verification:** Determinism, missing data, deload, poor recovery, missed weeks and protected-workout fixtures. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T14 Review apply and undo plan changes

- [ ] Complete T14.

**Description:** Deliver the proposal review UI and revision repository slice.
**Dependencies:** T13.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Preview selected before/after changes.
- [ ] reject stale revisions.
- [ ] undo only still-future accepted changes.

**Verification:** Concurrent edit, partial acceptance, repeated apply and completed-workout invariants. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T15 Publish workouts to the calendar

- [ ] Complete T15.

**Description:** Deliver the calendar adapter and outbox slice.
**Dependencies:** T10, T14.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Choose a writable calendar.
- [ ] publish linked events idempotently.
- [ ] expose external-edit/deletion conflicts.

**Verification:** Permission revocation, DST, insert-before-ack crash and unrelated-event preservation. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T15

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.

## T16 Download bounded map areas

- [ ] Complete T16.

**Description:** Deliver the map download state and resource cache slice.
**Dependencies:** T09.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Enforce provider byte/tile/concurrency limits.
- [ ] verify style/sprite/glyph availability.
- [ ] expose offline readiness.

**Verification:** Incomplete resources, interrupted download and oversize-area cases. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T17 Create and restore portable backups

- [ ] Complete T17.

**Description:** Deliver the backup serializer and restore flow slice.
**Dependencies:** T07, T10.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Export a consistent manifest snapshot.
- [ ] validate archive contents.
- [ ] stage replacement with a pre-restore backup.

**Verification:** Full round-trip, corrupt hash, traversal, unsupported version and failed staging tests. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T18 Render customizable share images

- [ ] Complete T18.

**Description:** Deliver the share spec renderer and composer slice.
**Dependencies:** T05, T07.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Implement four templates and three dimensions.
- [ ] reflow selected fields.
- [ ] render alpha and privacy trims.

**Verification:** Decode exported pixels; inspect all sizes and long titles; test user-photo metadata removal. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T19 Export GPX and share locally

- [ ] Complete T19.

**Description:** Deliver the file/share adapters and GPX export preview slice.
**Dependencies:** T18.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Share via temporary content URI.
- [ ] save PNG.
- [ ] export timestamped segmented GPX with route-disclosure preview.

**Verification:** Cancelled shares, expired URIs, alpha handling and manual Strava uploader walkthrough. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T19

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.

## T20 Validate accessibility and lifecycle polish

- [ ] Complete T20.

**Description:** Deliver the screen semantics and local diagnostics slice.
**Dependencies:** T08, T12, T15, T17, T19.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Support TalkBack and 200 percent text.
- [ ] respect reduced motion.
- [ ] expose checkpoint, calendar and backup state.

**Verification:** Physical-device screen-reader, compact layout and both-theme walkthroughs. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T21 Complete personal field validation

- [ ] Complete T21.

**Description:** Deliver the local observation records and regression fixtures slice.
**Dependencies:** T16, T20.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Complete three 60-minute locked-screen runs.
- [ ] measure battery and trace behavior.
- [ ] observe coach proposals over two weeks.

**Verification:** Record actual results, failures and corrections; no sole-recorder promotion until required gates pass. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T22 Package the first personal release

- [ ] Complete T22.

**Description:** Deliver the release configuration and documentation slice.
**Dependencies:** T21.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Test migrations and restore.
- [ ] build a locally signed APK.
- [ ] record known limits and release evidence.

**Verification:** Install/update on the target phone; signing material remains outside the repository. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T22

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.

## T23 Add personal route heatmaps

- [ ] Complete T23.

**Description:** Deliver the map density aggregation and filters slice.
**Dependencies:** T22.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Count traversals per cell per activity.
- [ ] filter by date.
- [ ] distinguish personal frequency from population popularity.

**Verification:** Sampling-rate invariance, repeated-route and deleted-activity tests. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T24 Import GPX history

- [ ] Complete T24.

**Description:** Deliver the bounded parser and import review slice.
**Dependencies:** T22.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Preview new/duplicate/invalid files.
- [ ] preserve timestamps/source.
- [ ] keep undated routes out of training load.

**Verification:** Repeat import, malformed XML, DTD, invalid coordinates and resource-limit cases. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

## T25 Track shoe mileage

- [ ] Complete T25.

**Description:** Deliver the shoe records and activity assignment slice.
**Dependencies:** T22.
**Estimated scope:** Medium feature slice; split further if necessary.

**Acceptance criteria:**
- [ ] Add/edit/retire shoes.
- [ ] sum linked distance plus starting offset.
- [ ] preserve history and configurable reminders.

**Verification:** Reassignment, activity deletion, retirement and restored-data calculations. For code slices, run focused unit tests, lint and debug assembly; use connected instrumentation where platform behavior is involved.

### Checkpoint after T25

- [ ] All affected checks pass and the feature flow works end to end.
- [ ] Record evidence and unresolved limitations; keep later features incomplete.
- [ ] Review the increment with the project owner.
