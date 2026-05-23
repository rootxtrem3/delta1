import 'package:flutter_test/flutter_test.dart';

import 'package:adaptive_wellness_coach/adaptive_wellness_ai.dart';

void main() {
  test('analysis pipeline returns structured AI-ready output', () async {
    await EnvConfig.load();

    final hasApiKey = EnvConfig.geminiApiKey.isNotEmpty;

    final pipeline = InsightPipeline(
      repository: DemoBehaviorRepository(),
      memoryStore: ContextMemoryStore(),
      geminiClient: GeminiClient.fromEnv(
        enableNetworkCalls: hasApiKey,
      ),
    );

    final daily = await pipeline.buildDailyAnalysis();
    final weekly = await pipeline.buildWeeklyReport();

    expect(daily.scores.wellness, inInclusiveRange(0, 100));
    expect(daily.patterns, isNotEmpty);
    expect(daily.recommendations, isNotEmpty);
    expect(daily.charts['sleep'], isNotEmpty);
    expect(daily.aiNarrative.model, GeminiClient.flashModel);
    expect(weekly.aiNarrative.model, GeminiClient.proModel);
  }, timeout: const Timeout(Duration(seconds: 60)));
}
