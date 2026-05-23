class UserProfile {
  const UserProfile({
    required this.userId,
    required this.firstName,
    required this.wakeHour,
    required this.sleepTargetHours,
    required this.workStyle,
    required this.priorities,
  });

  final String userId;
  final String firstName;
  final int wakeHour;
  final int sleepTargetHours;
  final String workStyle;
  final List<String> priorities;

  Map<String, Object> toJson() {
    return {
      'userId': userId,
      'firstName': firstName,
      'wakeHour': wakeHour,
      'sleepTargetHours': sleepTargetHours,
      'workStyle': workStyle,
      'priorities': priorities,
    };
  }
}
