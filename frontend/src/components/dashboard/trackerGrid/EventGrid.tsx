import { useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchMoodEntries } from '../../../redux/features/moodEntry/moodEntrySlice';

export default function Heatmap() {
	const dispatch = useAppDispatch();
	const { entries } = useAppSelector((state) => state.moodEntry);

	useEffect(() => {
		dispatch(fetchMoodEntries());
	}, [dispatch]);

	const heatmapValues = entries.map((entry) => {
		const date = new Date(entry.createdAt).toISOString().split('T')[0];
		return {
			date,
			count: Math.max(1, Math.min(3, entry.intensity ?? 1)),
			type: entry.type ?? 'neutral'
		};
	});

	const today = new Date();
	const yearAgo = new Date();
	yearAgo.setFullYear(today.getFullYear() - 1);

	return (
		<div className="p-4 border rounded-md w-full overflow-x-auto">
			<CalendarHeatmap
				startDate={yearAgo}
				endDate={today}
				values={heatmapValues}
				classForValue={(value: { date: string; count?: number; type?: string } | null) => {
					if (!value) return 'color-empty';

					const count = Math.max(1, Math.min(3, value.count ?? 1));
					const type = value.type ?? 'neutral';

					const classMap: Record<string, string[]> = {
						lucky: ['color-green1', 'color-green2', 'color-green3'],
						unlucky: ['color-orange1', 'color-orange2', 'color-orange3'],
						neutral: ['color-blue', 'color-blue', 'color-blue']
					};

					return classMap[type]?.[count - 1] || 'color-empty';
				}}
				tooltipDataAttrs={(value) => {
					if (!value?.date) return {};

					const formattedDate = new Date(value.date).toLocaleDateString('en-GB');

					const intensityMap: Record<number, string> = {
						1: 'Normal',
						2: 'Mid',
						3: 'Super'
					};

					const typeLabelMap: Record<string, string> = {
						lucky: '🍀 Lucky',
						unlucky: '😞 Unlucky',
						neutral: '😐 Neutral'
					};

					// ✅ Type cast to your expected type
					const typedValue = value as { date: string; count: number; type: string };

					const type = typedValue.type;
					const count = typedValue.count;

					const intensityLabel = intensityMap[count] || 'Unknown';
					const typeLabel = typeLabelMap[type] ?? '😐 Neutral';

					return {
						'data-tooltip-id': 'heatmap-tooltip',
						'data-tooltip-content':
							type === 'neutral'
								? `${formattedDate} - ${typeLabel}`
								: `${formattedDate} - ${typeLabel} (${intensityLabel})`
					};
				}}
				showWeekdayLabels
			/>
			<ReactTooltip id="heatmap-tooltip" />
		</div>
	);
}
