import '../domain/models/behavior_snapshot.dart';
import '../domain/models/user_profile.dart';

class DemoBehaviorRepository {
  Future<UserProfile> loadProfile() async {
    return const UserProfile(
      userId: 'demo-user',
      firstName: 'Amina',
      wakeHour: 6,
      sleepTargetHours: 8,
      workStyle: 'deep_work_blocks',
      priorities: ['sleep', 'focus', 'consistency'],
    );
  }

  Future<List<BehaviorSnapshot>> loadRecentSnapshots() async {
    return const [
      BehaviorSnapshot(
        dayLabel: 'Mon',
        sleepHours: 5.6,
        sleepStartHour: 0.8,
        productivityScore: 68,
        focusMinutes: 102,
        activeMinutes: 22,
        moodScore: 5,
        stressSelfReport: 7,
        journalText:
            'I felt scattered today and kept switching tasks. Energy dipped after lunch.',
        habitsCompleted: 2,
        habitsPlanned: 5,
      ),
      BehaviorSnapshot(
        dayLabel: 'Tue',
        sleepHours: 6.1,
        sleepStartHour: 23.9,
        productivityScore: 61,
        focusMinutes: 88,
        activeMinutes: 18,
        moodScore: 4,
        stressSelfReport: 8,
        journalText:
            'Busy day. I pushed through but felt mentally heavy and skipped my walk.',
        habitsCompleted: 1,
        habitsPlanned: 5,
      ),
      BehaviorSnapshot(
        dayLabel: 'Wed',
        sleepHours: 7.8,
        sleepStartHour: 22.7,
        productivityScore: 75,
        focusMinutes: 134,
        activeMinutes: 35,
        moodScore: 6,
        stressSelfReport: 5,
        journalText:
            'Better rhythm today. I planned the morning well and felt calmer.',
        habitsCompleted: 4,
        habitsPlanned: 5,
      ),
      BehaviorSnapshot(
        dayLabel: 'Thu',
        sleepHours: 5.2,
        sleepStartHour: 1.2,
        productivityScore: 55,
        focusMinutes: 79,
        activeMinutes: 12,
        moodScore: 4,
        stressSelfReport: 8,
        journalText:
            'Late night again. Hard to focus. I felt irritated by small things.',
        habitsCompleted: 1,
        habitsPlanned: 5,
      ),
      BehaviorSnapshot(
        dayLabel: 'Fri',
        sleepHours: 5.9,
        sleepStartHour: 0.6,
        productivityScore: 57,
        focusMinutes: 81,
        activeMinutes: 15,
        moodScore: 5,
        stressSelfReport: 7,
        journalText:
            'Still tired. I got some work done but it took more effort than usual.',
        habitsCompleted: 2,
        habitsPlanned: 5,
      ),
      BehaviorSnapshot(
        dayLabel: 'Sat',
        sleepHours: 8.4,
        sleepStartHour: 22.4,
        productivityScore: 63,
        focusMinutes: 93,
        activeMinutes: 44,
        moodScore: 7,
        stressSelfReport: 4,
        journalText:
            'Recovery day. A walk helped. I felt lighter and more present.',
        habitsCompleted: 3,
        habitsPlanned: 4,
      ),
      BehaviorSnapshot(
        dayLabel: 'Sun',
        sleepHours: 7.1,
        sleepStartHour: 23.2,
        productivityScore: 70,
        focusMinutes: 111,
        activeMinutes: 31,
        moodScore: 6,
        stressSelfReport: 5,
        journalText:
            'Decent balance today. Planning next week made me feel more in control.',
        habitsCompleted: 4,
        habitsPlanned: 5,
      ),
    ];
  }
}
