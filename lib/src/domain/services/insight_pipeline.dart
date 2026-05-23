import '../models/behavior_snapshot.dart';
import '../models/chart_point.dart';
import '../models/user_profile.dart';
import '../models/wellness_analysis.dart';
import '../../data/demo_behavior_repository.dart';
import 'context_memory_store.dart';
import 'feature_extractor.dart';
import 'gemini_client.dart';
import 'pattern_detector.dart';
import 'prompt_templates.dart';
import 'recommendation_engine.dart';
import 'wellness_scorer.dart';

class InsightPipeline {
  InsightPipeline({
    required this.repository,
    required this.memoryStore,
    required this.geminiClient,
    FeatureExtractor? extractor,
    PatternDetector? detector,
    WellnessScorer? scorer,
    RecommendationEngine? recommendationEngine,
    PromptTemplates? promptTemplates,
  })  : extractor = extractor ?? const FeatureExtractor(),
        detector = detector ?? const PatternDetector(),
        scorer = scorer ?? const WellnessScorer(),
        recommendationEngine =
            recommendationEngine ?? const RecommendationEngine(),
        promptTemplates = promptTemplates ?? const PromptTemplates();

  final DemoBehaviorRepository repository;
  final ContextMemoryStore memoryStore;
  final GeminiClient geminiClient;
  final FeatureExtractor extractor;
  final PatternDetector detector;
  final WellnessScorer scorer;
  final RecommendationEngine recommendationEngine;
  final PromptTemplates promptTemplates;

  Future<WellnessAnalysis> buildDailyAnalysis() async {
    final profile = await repository.loadProfile();
    final snapshots = await repository.loadRecentSnapshots();
    return _buildAnalysis(
      profile: profile,
      snapshots: snapshots,
      useWeeklyModel: false,
    );
  }

  Future<WellnessAnalysis> buildWeeklyReport() async {
    final profile = await repository.loadProfile();
    final snapshots = await repository.loadRecentSnapshots();
    return _buildAnalysis(
      profile: profile,
      snapshots: snapshots,
      useWeeklyModel: true,
    );
  }

  Future<WellnessAnalysis> _buildAnalysis({
    required UserProfile profile,
    required List<BehaviorSnapshot> snapshots,
    required bool useWeeklyModel,
  }) async {
    final features = extractor.extract(snapshots);
    final patterns = detector.detect(features);
    final scores = scorer.score(features);
    final recommendations = recommendationEngine.build(
      profile: profile,
      features: features,
      patterns: patterns,
    );

    final localAnalysis = WellnessAnalysis(
      scores: scores,
      patterns: patterns,
      moodTrend: _buildMoodTrend(features, snapshots),
      recommendations: recommendations,
      charts: _buildCharts(snapshots, scores),
      aiNarrative: const AiNarrative(
        model: 'local-pipeline',
        summary: 'Local analysis complete.',
        coachingMessage: 'Preparing adaptive coaching layer.',
      ),
    );

    final memoryContext = memoryStore.snapshot();
    final prompt = useWeeklyModel
        ? promptTemplates.weeklyReportPrompt(
            profile: profile,
            snapshots: snapshots,
            localAnalysis: localAnalysis,
            memoryContext: memoryContext,
          )
        : promptTemplates.dailyCoachPrompt(
            profile: profile,
            snapshots: snapshots,
            localAnalysis: localAnalysis,
            memoryContext: memoryContext,
          );

    final geminiResult = await geminiClient.generateJson(
      model: useWeeklyModel ? GeminiClient.proModel : GeminiClient.flashModel,
      prompt: prompt,
    );

    final aiNarrative = AiNarrative(
      model: geminiResult.model,
      summary: (geminiResult.json['summary'] as String?) ??
          'No AI summary was returned.',
      coachingMessage: (geminiResult.json['coachingMessage'] as String?) ??
          'No coaching message was returned.',
    );

    memoryStore.add({
      'timestamp': DateTime.now().toIso8601String(),
      'scores': scores.toJson(),
      'topPatterns': patterns.take(3).map((item) => item.name).toList(),
    });

    return WellnessAnalysis(
      scores: scores,
      patterns: patterns,
      moodTrend: _buildMoodTrend(features, snapshots),
      recommendations: recommendations,
      charts: _buildCharts(snapshots, scores),
      aiNarrative: aiNarrative,
    );
  }

  MoodTrend _buildMoodTrend(
    BehaviorFeatures features,
    List<BehaviorSnapshot> snapshots,
  ) {
    final direction = features.sentimentBalance >= 0 ? 'improving' : 'strained';
    final indicators = <String>[
      if (features.averageStress > 6) 'elevated self-reported stress',
      if (features.averageMood < 5.5) 'lower average mood stability',
      if (snapshots.any((item) => item.journalText.toLowerCase().contains('tired')))
        'repeated fatigue language in journaling',
    ];

    return MoodTrend(
      summary:
          'Mood tracking and journaling suggest a $direction emotional trend with recovery-sensitive days.',
      sentimentDirection: direction,
      indicators: indicators,
    );
  }

  Map<String, List<ChartPoint>> _buildCharts(
    List<BehaviorSnapshot> snapshots,
    WellnessScores scores,
  ) {
    return {
      'sleep': snapshots
          .map((item) => ChartPoint(label: item.dayLabel, value: item.sleepHours))
          .toList(),
      'focus': snapshots
          .map(
            (item) => ChartPoint(
              label: item.dayLabel,
              value: item.focusMinutes.toDouble(),
            ),
          )
          .toList(),
      'mood': snapshots
          .map(
            (item) => ChartPoint(
              label: item.dayLabel,
              value: item.moodScore.toDouble(),
            ),
          )
          .toList(),
      'scoreSummary': [
        ChartPoint(label: 'Wellness', value: scores.wellness.toDouble()),
        ChartPoint(label: 'Stress', value: scores.stressEstimate.toDouble()),
        ChartPoint(label: 'Recovery', value: scores.recovery.toDouble()),
        ChartPoint(label: 'Focus', value: scores.focus.toDouble()),
        ChartPoint(label: 'Consistency', value: scores.consistency.toDouble()),
      ],
    };
  }
}
