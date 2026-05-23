import '../models/behavior_snapshot.dart';
import '../models/user_profile.dart';
import '../models/wellness_analysis.dart';

class PromptTemplates {
  const PromptTemplates();

  Map<String, Object> dailyCoachPrompt({
    required UserProfile profile,
    required List<BehaviorSnapshot> snapshots,
    required WellnessAnalysis localAnalysis,
    required List<Map<String, Object>> memoryContext,
  }) {
    return {
      'system': '''
You are an adaptive wellness coach.
Never provide medical diagnosis.
Use language such as behavioral indicators, possible stress patterns, and wellness trends.
Return JSON only.
''',
      'input': {
        'profile': profile.toJson(),
        'recentSnapshots': snapshots.map((e) => e.toJson()).toList(),
        'localAnalysis': localAnalysis.toJson(),
        'memoryContext': memoryContext,
      },
      'output_schema': {
        'summary': 'string',
        'coachingMessage': 'string',
        'focusArea': 'string',
      },
    };
  }

  Map<String, Object> weeklyReportPrompt({
    required UserProfile profile,
    required List<BehaviorSnapshot> snapshots,
    required WellnessAnalysis localAnalysis,
    required List<Map<String, Object>> memoryContext,
  }) {
    return {
      'system': '''
You produce a weekly behavioral synthesis for a wellness app.
Avoid clinical labeling.
Explain trends clearly and keep the report actionable.
Return JSON only.
''',
      'input': {
        'profile': profile.toJson(),
        'recentSnapshots': snapshots.map((e) => e.toJson()).toList(),
        'localAnalysis': localAnalysis.toJson(),
        'memoryContext': memoryContext,
      },
      'output_schema': {
        'summary': 'string',
        'coachingMessage': 'string',
        'trendHighlights': ['string'],
      },
    };
  }
}
