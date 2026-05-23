class RecommendationItem {
  const RecommendationItem({
    required this.title,
    required this.reason,
    required this.timeWindow,
    required this.priority,
  });

  final String title;
  final String reason;
  final String timeWindow;
  final String priority;

  Map<String, Object> toJson() {
    return {
      'title': title,
      'reason': reason,
      'timeWindow': timeWindow,
      'priority': priority,
    };
  }
}
