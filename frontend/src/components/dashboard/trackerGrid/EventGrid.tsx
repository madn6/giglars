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
    // convert to Indian time (IST: UTC+5:30)
    const istDate = new Date(new Date(entry.createdAt).getTime() + 5.5 * 60 * 60 * 1000);
    
    // use this adjusted date to extract YYYY-MM-DD for the heatmap
    const date = istDate.toISOString().split('T')[0];
  
    return {
      date,
      count: Math.max(1, Math.min(3, entry.intensity ?? 1)),
      type: entry.type ?? 'neutral',
      displayDate: istDate.toLocaleDateString('en-GB'), // for tooltips in dd/mm/yyyy
    };
  });
  

	const today = new Date();
	const yearAgo = new Date();
	yearAgo.setFullYear(today.getFullYear() - 1);

	return (
		<div className="w-full overflow-x-auto ">
			<div className="min-w-[900px] p-4 border bg-secondary border-border/20 rounded-md h-full  scrollbar-thin ">
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
				<div className="flex items-center justify-between  text-sm text-gray-text">
					{/* Lucky Intensity */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<div className="w-4 h-4 rounded-sm bg-[rgb(34,197,94)]" />
							<span>Lucky - Normal</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-4 h-4 rounded-sm bg-[rgb(21,128,61)]" />
							<span>Lucky - Mid</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-4 h-4 rounded-sm bg-[rgb(20,83,45)]" />
							<span>Lucky - Super</span>
						</div>
					</div>

					{/* Unlucky Intensity */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<div className="w-4 h-4 rounded-sm bg-[rgb(249,115,22)]" />
							<span>Unlucky - Normal</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-4 h-4 rounded-sm bg-[rgb(194,65,12)]" />
							<span>Unlucky - Mid</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-4 h-4 rounded-sm bg-[rgb(124,45,18)]" />
							<span>Unlucky - Super</span>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-4 h-4 rounded-sm bg-[rgb(59,130,246)]" />
						<span>Neutral</span>
					</div>
				</div>
			</div>
		</div>
	);
}
