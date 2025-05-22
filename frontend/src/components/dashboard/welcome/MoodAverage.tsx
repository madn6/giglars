import { useMemo, useState } from 'react';
import { Frown } from 'lucide-react';
import { Meh } from 'lucide-react';
import { Smile } from 'lucide-react';

import clsx from 'clsx';

// Define the structure of a mood entry
type MoodEntry = {
	intensity: number;
	createdAt: string;
};

// Define the props for the MoodAverage component
type Props = {
	entries: MoodEntry[];
};

// Define the mood representations
const moodMap = [
	<Frown className="w-18 h-18 text-orange-200" key="frown" />,
	<Meh className="w-18 h-18 text-blue-200" key="meh" />,
	<Smile className="w-18 h-18 text-green-200" key="smile" />
];

// Define the available time ranges
const ranges = [
	{ label: 'Last 7 days', value: 7 },
	{ label: 'Last 30 days', value: 30 },
	{ label: 'Last 6 months', value: 180 },
	{ label: 'Last 1 year', value: 365 }
];

export default function MoodAverage({ entries }: Props) {
	const [selectedRange, setSelectedRange] = useState(ranges[0]);

	// Filter entries based on the selected time range
	const filteredEntries = useMemo(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - selectedRange.value);
		return entries.filter((e) => new Date(e.createdAt) >= cutoff);
	}, [entries, selectedRange]);

	// Calculate the average mood intensity
	const moodScore = useMemo(() => {
		const valid = filteredEntries
			.filter((e) => typeof e.intensity === 'number')
			.map((e) => e.intensity);

		if (!valid.length) return 0;
		const sum = valid.reduce((a, b) => a + b, 0);
		return sum / valid.length;
	}, [filteredEntries]);

	const rounded = Math.round(moodScore);
	const moodLabels = ['unlucky', 'neutral', 'lucky'];
	const emoji = moodMap[rounded - 1] || '❓';

	// Define color variants for each mood
	const moodStyles = {
		lucky: 'bg-green-500/10 from-green-500/20 to-green-500/5 border-green-500/30 border',
		neutral: 'bg-blue-500/10 from-blue-500/20 to-blue-500/5 border-blue-500/30 border',
		unlucky: 'bg-orange-500/10 from-orange-500/20 to-orange-500/5 border-orange-500/30 border'
	};
	return (
		<div
			className={clsx(
				'p-4 font-inter rounded-md border text-white text-center space-y-4',
				moodStyles[moodLabels[rounded - 1] as keyof typeof moodStyles] ||
					'bg-gray-800 border-gray-600'
			)}
		>
			{' '}
			{/* Segmented Time Range Buttons */}
			<div className="flex justify-center flex-wrap gap-2">
				{ranges.map((range) => (
					<button
						key={range.value}
						onClick={() => setSelectedRange(range)}
						className={clsx(
							'px-3 py-1 rounded-md text-sm border shadow-2xl border-border/20 transition',
							selectedRange.value === range.value
								? 'bg-accent text-black font-medium'
								: 'bg-gray text-white hover:bg-border/20'
						)}
					>
						{range.label}
					</button>
				))}
			</div>
			{/* Average Mood Emoji */}
			<div className="flex justify-center items-center ">{emoji}</div>
			{/* Mood Description */}
			<p className="text-xl font-semibold font-dm-sans">Mood: {moodLabels[rounded - 1] || 'Unknown'}</p>
		</div>
	);
}
