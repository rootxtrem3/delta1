import '../models/wellness_analysis.dart';
import 'feature_extractor.dart';

class WellnessScorer {
  const WellnessScorer();

  WellnessScores score(BehaviorFeatures features) {
    final sleepScore = _clamp(100 - ((7.5 - features.averageSleepHours).abs() * 18));
    final stressPenalty = _clamp(features.averageStress * 10);
    final focusScore = _clamp((features.averageFocusMinutes / 150) * 100);
    final consistencyScore = _clamp(
      (features.habitCompletionRate * 70) + (100 - (features.sleepVariance * 20)),
    );
    final recoveryScore = _clamp(
      (sleepScore * 0.6) + ((features.activityAverage / 45) * 40),
    );
    final wellnessScore = _clamp(
      (sleepScore * 0.25) +
          ((100 - stressPenalty) * 0.25) +
          (focusScore * 0.2) +
          (recoveryScore * 0.15) +
          (consistencyScore * 0.15),
    );

    return WellnessScores(
      wellness: wellnessScore.round(),
      stressEstimate: stressPenalty.round(),
      recovery: recoveryScore.round(),
      focus: focusScore.round(),
      consistency: consistencyScore.round(),
    );
  }

  double _clamp(double value) {
    if (value < 0) {
      return 0;
    }
    if (value > 100) {
      return 100;
    }
    return value;
  }
}
