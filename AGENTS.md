# AGENTS.md — Adaptive Wellness Coach

## Quick start

```bash
flutter pub get
flutter test
```

## Key commands

| Command | Purpose |
|---------|---------|
| `flutter test` | Run all tests (single test file) |
| `flutter analyze` | Lint check (uses `flutter_lints`, rule: `prefer_single_quotes`) |

## Architecture

- **Package**: `adaptive_wellness_coach` — AI integration layer + demo data. No real app UI yet.
- **Entry points**: `lib/adaptive_wellness_ai.dart` (library barrel exports), `lib/main.dart` (placeholder app shell).
- **Orchestration**: `InsightPipeline` in `lib/src/domain/services/insight_pipeline.dart` wires local analysis → Gemini enrichment.
- **Model split**: `gemini-2.5-flash` for daily coaching, `gemini-2.5-pro` for weekly deep synthesis.

## Env & API key

- `.env` at project root must contain `GEMINI_API_KEY`. Ignored by git.
- Load via `await EnvConfig.load()` then `GeminiClient.fromEnv()`.
- Test uses `enableNetworkCalls: false` to avoid real API calls (see `test/ai_integration_test.dart`).

## Lint

- Single lint rule deviation from `flutter_lints`: `prefer_single_quotes: true` (set in `analysis_options.yaml`).

## Testing quirks

- Only one test file: `test/ai_integration_test.dart`. Runs local pipeline + verifies Gemini client fallback path.
- `GeminiClient` returns local fallback text when `apiKey` is empty or `enableNetworkCalls` is `false`.

## What's NOT here

- No app UI (placeholder screen in `lib/src/app_shell.dart` only).
- No production backend wiring.
- No CI workflow files.
- No codegen or migrations.
