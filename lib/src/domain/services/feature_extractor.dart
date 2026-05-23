import '../models/behavior_snapshot.dart';

class BehaviorFeatures {
  const BehaviorFeatures({
    required this.averageSleepHours,
    required this.sleepVariance,
    required this.productivitySlope,
    required this.averageFocusMinutes,
    required this.averageMood,
    required this.averageStress,
    required this.activityAverage,
    required this.habitCompletionRate,
    required this.sentimentBalance,
  });

  final double averageSleepHours;
  final double sleepVariance;
  final double productivitySlope;
  final double averageFocusMinutes;
  final double averageMood;
  final double averageStress;
  final double activityAverage;
  final double habitCompletionRate;
  final double sentimentBalance;
}

class FeatureExtractor {
  const FeatureExtractor();

  BehaviorFeatures extract(List<BehaviorSnapshot> items) {
    final avgSleep = _average(items.map((e) => e.sleepHours));
    final avgFocus = _average(items.map((e) => e.focusMinutes.toDouble()));
    final avgMood = _average(items.map((e) => e.moodScore.toDouble()));
    final avgStress = _average(items.map((e) => e.stressSelfReport.toDouble()));
    final activityAverage =
        _average(items.map((e) => e.activeMinutes.toDouble()));
    final totalCompleted =
        items.fold<int>(0, (sum, item) => sum + item.habitsCompleted);
    final totalPlanned =
        items.fold<int>(0, (sum, item) => sum + item.habitsPlanned);

    return BehaviorFeatures(
      averageSleepHours: avgSleep,
      sleepVariance: _variance(items.map((e) => e.sleepHours), avgSleep),
      productivitySlope:
          _slope(items.map((e) => e.productivityScore.toDouble()).toList()),
      averageFocusMinutes: avgFocus,
      averageMood: avgMood,
      averageStress: avgStress,
      activityAverage: activityAverage,
      habitCompletionRate:
          totalPlanned == 0 ? 0 : totalCompleted / totalPlanned.toDouble(),
      sentimentBalance: _sentimentBalance(items),
    );
  }

  double _average(Iterable<double> values) {
    final list = values.toList();
    if (list.isEmpty) {
      return 0;
    }
    return list.reduce((a, b) => a + b) / list.length;
  }

  double _variance(Iterable<double> values, double mean) {
    final list = values.toList();
    if (list.isEmpty) {
      return 0;
    }
    final squaredDiffs =
        list.map((value) => (value - mean) * (value - mean)).toList();
    return squaredDiffs.reduce((a, b) => a + b) / list.length;
  }

  double _slope(List<double> values) {
    if (values.length < 2) {
      return 0;
    }

    final n = values.length;
    final xMean = (n - 1) / 2;
    final yMean = _average(values);

    double numerator = 0;
    double denominator = 0;
    for (var i = 0; i < n; i++) {
      final xDiff = i - xMean;
      numerator += xDiff * (values[i] - yMean);
      denominator += xDiff * xDiff;
    }

    return denominator == 0 ? 0 : numerator / denominator;
  }

  double _sentimentBalance(List<BehaviorSnapshot> items) {
    const positiveWords = ['better', 'calmer', 'lighter', 'control', 'present'];
    const negativeWords = ['scattered', 'heavy', 'hard', 'irritated', 'tired'];

    var score = 0;
    for (final item in items) {
      final text = item.journalText.toLowerCase();
      score += positiveWords.where(text.contains).length;
      score -= negativeWords.where(text.contains).length;
    }
    return score.toDouble();
  }
}
