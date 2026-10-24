# UI and UX review — candidate 02

**84 unique mobile frames**, including first-run setup, Today, recording and recovery, activity review, progress, generated/manual training, adaptive review and undo, routes, four sharing templates, calendar, backup/restore, personal history features, light theme and accessibility layouts.

This is an interactive visual review. Running, GPS, calendar events, file exports and external sharing are not implemented. Frame navigation and local control feedback are demonstrated; edits do not persist across frames.

## Open the complete review

From the repository root, with an existing Node.js installation:

```powershell
node design/review/serve.mjs 4186
```

Open [the local review](http://127.0.0.1:4186/review/index.html). Select a group, choose a frame, or click through a connected flow. **All frames** displays the full set. **Less motion** provides gentler feedback; the operating-system preference is also respected. Keyboard navigation changes frames instantly.

No paid libraries, cloud service, account connection or API key is needed for this review. Fonts and icons are bundled locally with their upstream licenses.

## Figma status

[Editable Figma working file](https://www.figma.com/design/7CpE47wcyMtInNRhbwt3tD)

The Starter MCP quota stopped work after **31 composed frames**. The other named wrappers are empty. The complete browser review is the current review deliverable and also includes subsequent chart-label and control-height refinements. Do not treat the Figma working file as the complete or approved design.

The [local import package](figma-import/README.md) builds all 84 in a new blank Design file through the editor's developer-plugin workflow. Its full native-editor execution remains unverified; its JavaScript syntax and shared scene data were checked. The package does not access the network.

## Design evidence

- [Design contract and reference analysis](design-contract.md)
- [Full frame inventory](inventory.md)
- [Shared frame data](screens.json)
- [Shared scene composition](scene.mjs)
- [Verification record](verification.md)

Typography: Manrope for interface text, Roboto Condensed for running metrics. Palette: graphite, soft white and selective lime, with semantic warning/error colors. The original portfolio reports remain the planning baseline until the project owner reviews this candidate.

## Checks

```powershell
node --test design/review/tests.mjs
```

The browser review uses semantic buttons, labeled navigation and switches, an internal scrolling area above persistent actions, accessible chart summaries and bundled assets. The compact and large-text frames are review aids; native TalkBack, outdoor contrast, Android font scaling and physical gestures still require device testing.
