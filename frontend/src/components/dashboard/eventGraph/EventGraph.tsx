import {
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid
} from 'recharts';

import { motion } from 'framer-motion';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import { ChartSpline } from 'lucide-react';

type EventGraphProps = {
	entries: MoodEntry[];
};

export default function EventGraph({ entries }: EventGraphProps) {
	const lineChartData = entries.map((entry) => {
		const date = new Date(entry.createdAt);
		return {
			date: date.toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short'
			}),
			intensity: entry.intensity
		};
	});

	return (
		<div className=" p-4 md:p-6 rounded-lg h-fit border font-inter border-border/20 bg-secondary text-white space-y-8">
			<div className="flex items-center justify-center gap-1 mb-6 ">
				<ChartSpline size={20} />
				<h2 className="text-xl font-semibold text-center">Mood Overview</h2>
			</div>

			{/* Line Chart for Intensity Over Time */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				{/* <h3 className="text-sm sm:text-base font-medium text-gray-text mb-4 text-center">
					Mood Intensity Over Time
				</h3> */}
				<div className="w-full h-[200px] md:h-[220px] lg:h-[330px]">
					<ResponsiveContainer width="100%" aspect={0}>
						<LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
							<CartesianGrid strokeDasharray="4 4" vertical={false} />
							<XAxis
								dataKey="date"
								className="text-[10px] sm:text-xs"
								interval="preserveStartEnd"
								padding={{ left: 0, right: 0 }}
							/>
							<YAxis
								dataKey="intensity"
								domain={[1, 3]}
								ticks={[1, 2, 3]}
								className="text-xs"
								width={20}
							/>
							<Tooltip
								contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
								labelStyle={{ color: '#f3f4f6' }}
								itemStyle={{ color: '#facc15' }}
								formatter={(value: number) => [`Intensity: ${value}`, '']}
							/>
							<Line
								type="monotone"
								dataKey="intensity"
								stroke="#00C49F"
								strokeWidth={3}
								dot={{ r: 4, fill: '#00C49F' }}
								activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</motion.div>
		</div>
	);
}
