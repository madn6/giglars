import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	Cell
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useEffect } from 'react';
import { fetchMoodEntries } from '../../../redux/features/moodEntry/moodEntrySlice';
import { motion } from 'framer-motion';

export default function EventGraph() {
	const dispatch = useAppDispatch();
	const { entries } = useAppSelector((state) => state.moodEntry);
	console.log(entries);

	useEffect(() => {
		dispatch(fetchMoodEntries());
	}, [dispatch]);

	// Format dates and prepare data
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

	const moodCounts = entries.reduce(
		(acc, entry) => {
			const type = entry.type as keyof typeof acc;
			acc[type] = (acc[type] || 0) + 1;
			return acc;
		},
		{ lucky: 0, unlucky: 0, neutral: 0 }
	);

	const barChartData = Object.entries(moodCounts).map(([type, count]) => ({
		name: type,
		count
	}));

	return (
		<div className="p-4 sm:p-6 md:p-8 rounded-md border font-inter border-border/20 bg-secondary text-white space-y-8">
			<h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Mood Overview</h2>

			{/* Line Chart for Intensity Over Time */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				<h3 className="text-sm sm:text-base font-medium text-gray-text mb-4 text-center">
					Mood Intensity Over Time
				</h3>
				<ResponsiveContainer width="100%" aspect={2}>
					<LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="4 4" vertical={false} />
						<XAxis dataKey="date" className="text-[10px] sm:text-xs" interval="preserveStartEnd"  padding={{ left: 0, right: 0 }} />
						<YAxis dataKey="intensity" domain={[1, 3]} ticks={[1, 2, 3]} className="text-xs" width={20}/>
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
			</motion.div>

			{/* Bar Chart for Mood Type Distribution */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				<h3 className="text-sm sm:text-base font-medium mb-4 text-center text-gray-text">
					Mood Type Count
				</h3>
				<ResponsiveContainer width="100%" aspect={2}>
					<BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="4 4" vertical={false} />
						<XAxis dataKey="name" className="text-xs" />
						<YAxis className="text-xs" width={20}/>
						<Tooltip />
						<Bar dataKey="count">
							{barChartData.map((entry) => (
								<Cell
									key={entry.name}
									fill={
										entry.name === 'lucky'
											? '#22c55e'
											: entry.name === 'unlucky'
											? '#f97316'
											: '#3b82f6'
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
}
