type Props = {
	moodScore: number; // value from 1 (bad) to 5 (great)
};

const moodMap = ['😞', '😐', '😁'];

export default function MoodAverage({ moodScore }: Props) {
	const rounded = Math.round(moodScore);
	const emoji = moodMap[rounded - 1] || '❓';

	return (
		<div className="p-4 rounded-md border border-border text-white text-center">
			<div className="text-3xl">{emoji}</div>
			<p className="text-sm mt-1">Mood Avg: {rounded}</p>
		</div>
	);
}
