declare module 'react-calendar-heatmap' {
	import * as React from 'react';

	export interface HeatmapValue {
		date: string;
		count?: number;
		[key: string]: unknown;
	}

	export interface CalendarHeatmapProps {
		startDate: Date | string;
		endDate: Date | string;
		values: HeatmapValue[];
		classForValue?: (value: HeatmapValue | null) => string;
		tooltipDataAttrs?: (value: HeatmapValue | null) => object;
		showWeekdayLabels?: boolean;
		[key: string]: unknown;
	}

	const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
	export default CalendarHeatmap;
}
