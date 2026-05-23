import '../models/wellness_analysis.dart';
import 'feature_extractor.dart';

class PatternDetector {
  const PatternDetector();

  List<PatternSignal> detect(BehaviorFeatures features) {
    final results = <PatternSignal>[];

    if (features.averageSleepHours < 6.5 && features.sleepVariance > 0.8) {
      results.add(
        const PatternSignal(
          name: 'sleep_inconsistency',
          severity: 'high',
          explanation:
              'Sleep timing and duration are unstable, which can amplify fatigue and recovery drag.',
        ),
      );
    }

    if (features.productivitySlope < -1.2 && features.averageStress > 6.2) {
      results.add(
        const PatternSignal(
          name: 'burnout_trend',
          severity: 'high',
          explanation:
              'Productivity is declining while stress remains elevated, suggesting possible overload patterns.',
        ),
      );
    }

    if (features.averageFocusMinutes < 95) {
      results.add(
        const PatternSignal(
          name: 'focus_degradation',
          severity: 'medium',
          explanation:
              'Sustained focus time is below target, indicating attention fragmentation across the week.',
        ),
      );
    }

    if (features.activityAverage < 20) {
      results.add(
        const PatternSignal(
          name: 'inactivity_periods',
          severity: 'medium',
          explanation:
              'Movement levels are low enough to weaken recovery and energy regulation.',
        ),
      );
    }

    if (features.habitCompletionRate < 0.55) {
      results.add(
        const PatternSignal(
          name: 'habit_inconsistency',
          severity: 'medium',
          explanation:
              'Routine completion is uneven, which makes wellness momentum harder to maintain.',
        ),
      );
    }

    if (features.averageMood < 5.5 && features.sentimentBalance < 0) {
      results.add(
        const PatternSignal(
          name: 'emotional_instability_pattern',
          severity: 'medium',
          explanation:
              'Mood and journaling signals suggest possible stress patterns and reduced emotional steadiness.',
        ),
      );
    }

    return results;
  }
}
