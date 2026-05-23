class BehaviorSnapshot {
  const BehaviorSnapshot({
    required this.dayLabel,
    required this.sleepHours,
    required this.sleepStartHour,
    required this.productivityScore,
    required this.focusMinutes,
    required this.activeMinutes,
    required this.moodScore,
    required this.stressSelfReport,
    required this.journalText,
    required this.habitsCompleted,
    required this.habitsPlanned,
  });

  final String dayLabel;
  final double sleepHours;
  final double sleepStartHour;
  final int productivityScore;
  final int focusMinutes;
  final int activeMinutes;
  final int moodScore;
  final int stressSelfReport;
  final String journalText;
  final int habitsCompleted;
  final int habitsPlanned;

  Map<String, Object> toJson() {
    return {
      'dayLabel': dayLabel,
      'sleepHours': sleepHours,
      'sleepStartHour': sleepStartHour,
      'productivityScore': productivityScore,
      'focusMinutes': focusMinutes,
      'activeMinutes': activeMinutes,
      'moodScore': moodScore,
      'stressSelfReport': stressSelfReport,
      'journalText': journalText,
      'habitsCompleted': habitsCompleted,
      'habitsPlanned': habitsPlanned,
    };
  }
}
