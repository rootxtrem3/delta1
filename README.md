# Adaptive Wellness AI Integration

A Flutter-compatible Dart integration layer for behavioral intelligence, demo data, and Gemini-powered wellness analysis.

## Included

- analyzes activity, sleep, mood, journaling, and focus signals
- detects behavioral indicators such as burnout trends, sleep inconsistency, and habit instability
- produces explainable scores for wellness, stress, recovery, focus, and consistency
- generates adaptive daily coaching recommendations
- routes heavy weekly synthesis to `Gemini 2.5 Pro` and fast daily coaching to `Gemini Flash`
- exposes structured outputs that a Flutter frontend can chart directly
- includes demo behavioral data for local analysis without backend wiring

## Scope

This package intentionally includes only:

- AI integration logic
- demo data
- local analysis and scoring
- Gemini prompt and response handling

It does not include finished app UI, production Android screens, or backend wiring.

## Repository structure

This repo now follows a standard Flutter layout at the top level:

- `lib/` contains the AI integration and a minimal placeholder app entrypoint
- `test/` contains integration-layer tests
- `android/`, `ios/`, `web/`, `linux/`, `macos/`, and `windows/` are present as platform placeholders until full app scaffolding is generated

## Setup

1. Install Flutter locally.
2. Put your key in the project root `.env` file:

```env
GEMINI_API_KEY=your_real_gemini_api_key
```

3. Install dependencies:

```bash
flutter pub get
```

4. Before using the AI integration in your app or test harness, load the env file:

```dart
import 'package:adaptive_wellness_coach/adaptive_wellness_ai.dart';

await EnvConfig.load();

final geminiClient = GeminiClient.fromEnv();
```

5. Run tests or integrate the library into your app:

```bash
flutter test
```

## Model split

- `gemini-2.5-flash`: daily recommendations, chat-like coaching turns, low-latency summaries
- `gemini-2.5-pro`: weekly deep reasoning, longitudinal synthesis, nuanced behavioral narrative

## Notes

- The app deliberately avoids clinical language.
- Outputs use terms like `behavioral indicators`, `possible stress patterns`, and `wellness trends`.
- The built-in demo repository seeds realistic sample data so the analysis pipeline works before backend integration.
