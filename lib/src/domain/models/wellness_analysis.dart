import 'chart_point.dart';
import 'recommendation_item.dart';

class WellnessScores {
  const WellnessScores({
    required this.wellness,
    required this.stressEstimate,
    required this.recovery,
    required this.focus,
    required this.consistency,
  });

  final int wellness;
  final int stressEstimate;
  final int recovery;
  final int focus;
  final int consistency;

  Map<String, Object> toJson() {
    return {
      'wellness': wellness,
      'stressEstimate': stressEstimate,
      'recovery': recovery,
      'focus': focus,
      'consistency': consistency,
    };
  }
}

class PatternSignal {
  const PatternSignal({
    required this.name,
    required this.severity,
    required this.explanation,
  });

  final String name;
  final String severity;
  final String explanation;

  Map<String, Object> toJson() {
    return {
      'name': name,
      'severity': severity,
      'explanation': explanation,
    };
  }
}

class MoodTrend {
  const MoodTrend({
    required this.summary,
    required this.sentimentDirection,
    required this.indicators,
  });

  final String summary;
  final String sentimentDirection;
  final List<String> indicators;

  Map<String, Object> toJson() {
    return {
      'summary': summary,
      'sentimentDirection': sentimentDirection,
      'indicators': indicators,
    };
  }
}

class AiNarrative {
  const AiNarrative({
    required this.model,
    required this.summary,
    required this.coachingMessage,
  });

  final String model;
  final String summary;
  final String coachingMessage;

  Map<String, Object> toJson() {
    return {
      'model': model,
      'summary': summary,
      'coachingMessage': coachingMessage,
    };
  }
}

class WellnessAnalysis {
  const WellnessAnalysis({
    required this.scores,
    required this.patterns,
    required this.moodTrend,
    required this.recommendations,
    required this.charts,
    required this.aiNarrative,
  });

  final WellnessScores scores;
  final List<PatternSignal> patterns;
  final MoodTrend moodTrend;
  final List<RecommendationItem> recommendations;
  final Map<String, List<ChartPoint>> charts;
  final AiNarrative aiNarrative;

  Map<String, Object> toJson() {
    return {
      'scores': scores.toJson(),
      'patterns': patterns.map((item) => item.toJson()).toList(),
      'moodTrend': moodTrend.toJson(),
      'recommendations':
          recommendations.map((item) => item.toJson()).toList(),
      'charts': charts.map(
        (key, value) => MapEntry(
          key,
          value.map((point) => point.toJson()).toList(),
        ),
      ),
      'aiNarrative': aiNarrative.toJson(),
    };
  }
}
