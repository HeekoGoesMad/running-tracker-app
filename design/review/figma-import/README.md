# Local Figma import

This optional developer plugin constructs all 84 review frames as editable text, vectors, auto-layout and component instances. It uses the free editor workflow, without the MCP connector. It has no network access.

## How to use

1. Open a **new blank Figma Design file** in the desktop app.
2. Choose Plugins → Development → New plugin, select Figma Design and create a local plugin without a UI. Figma assigns its own plugin ID.
3. Replace the generated code.js with the bundled code.js. In the generated manifest, retain Figma’s assigned ID and use the API, documentAccess, editorType and networkAccess fields shown in manifest.example.json.
4. Run your local development plugin. The completed import is intended to have named flow groups and four prototype starting points.

The importer refuses a non-empty page or existing local variables. If it stops partway through, inspect the result and use a new blank file rather than retrying over partial output.

## Verification limits

The equivalent construction operations were verified for the first 31 frames through Figma MCP before its Starter quota was reached. This local developer-plugin package passes a JavaScript syntax check; its full native-editor import has **not** been executed in this session. Use the complete local browser review as the verified visual deliverable. No upgrade is required to review the screens.

All routes, metrics and check-ins are illustrative. This is a UI review, not an implemented running app.
