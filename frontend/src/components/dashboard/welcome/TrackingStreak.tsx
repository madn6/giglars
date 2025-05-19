import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';

type Props = {
  entries: MoodEntry[];
};
export default function TrackingStreak({ entries  }: Props) {
	function calculateStreak(entries: MoodEntry[]) {
		if (!entries.length) return 0;

		const daysSet = new Set(entries.map((e) => new Date(e.createdAt).toDateString()));

		let streak = 0;
		const current = new Date();

		while (daysSet.has(current.toDateString())) {
			streak++;
			current.setDate(current.getDate() - 1);
		}

		return streak;
  }
  
  const streak = calculateStreak(entries)

	return (
		<div className="p-4 rounded-md border border-border text-white text-center">
			<h3 className="text-lg font-semibold">🔥 Current Streak</h3>
			<p className="text-3xl font-bold text-yellow-400">{streak} days</p>
		</div>
	);
}
