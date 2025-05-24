import { useState } from 'react';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
// import { Flame } from 'lucide-react';
import clsx from 'clsx';

type Props = {
	entries: MoodEntry[];
};

// Normalize date to just the day
const toDateString = (date: Date | string) => new Date(date).toDateString();

// Calculate current streak ending today
function calculateCurrentStreak(entries: MoodEntry[]) {
	if (!entries.length) return 0;

	const daysSet = new Set(entries.map((e) => toDateString(e.createdAt)));

	let streak = 0;
	const current = new Date();

	while (daysSet.has(toDateString(current))) {
		streak++;
		current.setDate(current.getDate() - 1);
	}

	return streak;
}

//Calculate longest streak from all dates
function calculateLongestStreak(entries: MoodEntry[]) {
	if (!entries.length) return 0;

	const days = new Set(entries.map((e) => toDateString(e.createdAt)));

	const sortedDays = Array.from(days)
		.map((d) => new Date(d))
		.sort((a, b) => a.getTime() - b.getTime());

	let longest = 0;
	let currentStreak = 1;

	for (let i = 1; i < sortedDays.length; i++) {
		const prev = sortedDays[i - 1];
		const curr = sortedDays[i];

		const diffInDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

		if (diffInDays === 1) {
			currentStreak++;
		} else {
			longest = Math.max(longest, currentStreak);
			currentStreak = 1;
		}
	}

	return Math.max(longest, currentStreak);
}

export default function TrackingStreak({ entries }: Props) {
	const [selectedView, setSelectedView] = useState<'longest' | 'current'>('longest');

	const longestStreak = calculateLongestStreak(entries);
	const currentStreak = calculateCurrentStreak(entries);

	return (
		<div className="p-4 rounded-md font-inter  bg-rose-500/10 from-rose-500/20 to-rose-500/5 border-rose-500/30 border text-white text-center">
			<div className="flex items-center justify-center gap-2">
				<button
					onClick={() => setSelectedView('longest')}
					className={clsx(
						'px-3 py-1 rounded-md text-sm border border-border/20 transition',
						selectedView === 'longest'
							? 'bg-accent text-black font-medium'
							: 'bg-gray text-white hover:bg-border/30'
					)}
				>
					Longest
				</button>
				<button
					onClick={() => setSelectedView('current')}
					className={clsx(
						'px-3 py-1 rounded-md text-sm border border-border/20 transition',
						selectedView === 'current'
							? 'bg-accent text-black font-medium'
							: 'bg-gray text-white hover:bg-border/30'
					)}
				>
					Current
				</button>
			</div>

			<div className="mt-6 flex flex-col gap-2">
				<div className="text-3xl mb-2 font-dm-sans font-semibold">
					{selectedView === 'longest' ? (
						<div className="">longest Streak</div>
					) : (
						<div className="">current Streak</div>
					)}
				</div>
				<div className="flex flex-col items-center justify-center font-dm-sans">
					<p className="flex items-center gap-1 justify-center">
						{/* <Flame  className="!w-18 !h-18 text-rose-200 !m-0 !p-0" /> */}
						{selectedView === 'longest' ? (
							<span className="text-accent text-8xl font-bold">{longestStreak}</span>
						) : (
							<span className="text-accent text-8xl font-bold">{currentStreak}</span>
						)}
						<span className="text-rose-200 font-semibold text-3xl">
							{(selectedView === 'longest' ? longestStreak : currentStreak) === 1 ? 'day' : 'days'}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
