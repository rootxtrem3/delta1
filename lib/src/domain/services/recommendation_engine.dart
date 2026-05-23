import '../models/recommendation_item.dart';
import '../models/user_profile.dart';
import '../models/wellness_analysis.dart';
import 'feature_extractor.dart';

class RecommendationEngine {
  const RecommendationEngine();

  List<RecommendationItem> build({
    required UserProfile profile,
    required BehaviorFeatures features,
    required List<PatternSignal> patterns,
  }) {
    final items = <RecommendationItem>[];

    if (patterns.any((item) => item.name == 'sleep_inconsistency')) {
      items.add(
        RecommendationItem(
          title: 'Anchor your shutdown routine',
          reason:
              'Your recent sleep trend suggests better recovery if screens and work stop 90 minutes before your target bedtime.',
          timeWindow: 'Evening',
          priority: 'high',
        ),
      );
    }

    if (patterns.any((item) => item.name == 'burnout_trend')) {
      items.add(
        RecommendationItem(
          title: 'Schedule one protected low-load block',
          reason:
              'A deliberate recovery block can reduce possible overload patterns before they harden into a longer slump.',
          timeWindow: 'Next 24 hours',
          priority: 'high',
        ),
      );
    }

    if (patterns.any((item) => item.name == 'focus_degradation')) {
      items.add(
        RecommendationItem(
          title: 'Use 2 deep work windows before noon',
          reason:
              '${profile.firstName} appears to do better with structured focus windows than reactive task switching.',
          timeWindow: 'Morning',
          priority: 'medium',
        ),
      );
    }

    if (features.activityAverage < 25) {
      items.add(
        const RecommendationItem(
          title: 'Insert a 12-minute movement reset',
          reason:
              'Short movement breaks can improve energy regulation without adding much friction to the day.',
          timeWindow: 'Midday',
          priority: 'medium',
        ),
      );
    }

    if (items.length < 4) {
      items.add(
        RecommendationItem(
          title: 'Keep your first hour low-noise',
          reason:
              'A calmer start supports your priorities: ${profile.priorities.join(', ')}.',
          timeWindow: 'First hour after wake-up',
          priority: 'medium',
        ),
      );
    }

    return items;
  }
}
