# Architecture

## Extension Entry Points

- `manifest.json` is the Chrome extension Manifest V3 manifest.
- `src/background/index.js` is the service-worker entry point.
- `src/content/index.js` is the document-start content-script entry point.
- `src/popup/` defines the Google Translate disguised extension popup.

## Modular Layer Structure

### 1. Shared Layer (`src/shared/`)
- `MessageActions.js`: Unified messaging action constants between Background, Content, and Popup.
- `AiPrompts.js`: Shared system prompts for extractor, single question solver, and exam solver.
- `ModelConfig.js`: Default models, backup multi-tier models, and request timeouts.

### 2. Background Services (`src/background/`)
- `SupabaseCacheService.js`: Batch lookup and caching of solved questions in Supabase.
- `Key4uApiClient.js`: Key4U completions client with timeout abort, multi-tier backup model fallback, and fail-safe answer reconciliation.
- `ScreenshotUploadService.js`: Tab screenshot capture, size validation, and Supabase Storage upload.
- `StealthCaptureSolver.js`: Visible tab snip capture, DPR-scaled crop via OffscreenCanvas, dual-model consensus, cross-review, and dispatch to content script.
- `ContextMenuManager.js`: Right-click context menus setup and click event dispatching.
- `index.js`: Background Service Worker entry point and message routing.

### 3. Content Modules (`src/content/`)
- `core/`:
  - `TextUtils.js`: Text normalization, option prefix stripping, markdown table converter, and title sanitization.
  - `DomMediaExtractor.js`: Extraction of image URLs, base64 data, SVG/Canvas diagrams, and reading passages.
- `scanner/`:
  - `MoodleScanner.js`: Moodle LMS quiz (`.que`) structural scanner.
  - `QuizCardScanner.js`: Card-based quiz scanner (`.yh-question-card`, etc.) supporting Single Choice and True/False groups.
  - `AnchorBasedScanner.js`: Input anchor grouping and Lowest Common Ancestor (LCA) scanner.
  - `GenericDomScanner.js`: Flat layout DOM scanner.
  - `ExamDomScanner.js`: Scanner facade orchestrating all scan tiers and building extraction statistics.
- `clicker/`:
  - `DomAnswerClicker.js`: Complete pointer/mouse/focus/change event dispatch chain (`forceClickTarget`) for reliable option selection.
- `solver/`:
  - `ConsensusSolverEngine.js`: Dual-model AI solver and cross-review engine.
  - `ContinuousSolveRunner.js`: Continuous solving loop across questions and automatic page navigation.
- `ui/`:
  - `CaptureStatusNotifier.js`: Toast notifier for quick screenshot upload status.
  - `StealthToastNotifier.js`: Silent unobtrusive notification toast for solving actions.
  - `StealthSnipOverlay.js`: 100% transparent crop overlay with drag-and-drop screen coordinate calculation.
- `navigation/`:
  - `MoodleNavigationHandler.js`: Moodle error recovery and next page navigation.
- `controller/`:
  - `QuickCaptureController.js`: Quick capture controller triggering background upload.
  - `HotKeyManager.js`: Global hotkey manager intercepting `N`, `Alt+H`, `Alt+K`, `Alt+Y`, `M`, and `Esc`.
- `index.js`: Content script entry point connecting all modules.

## Build Flow

1. Update `.env` configuration.
2. Run `npm run sync:config` to regenerate `src/config/runtime-config.js`.
3. Run `npm run build` to dynamically scan and obfuscate all JS files into `dist/`.
4. Load or reload the generated `dist/` directory in Chrome.
