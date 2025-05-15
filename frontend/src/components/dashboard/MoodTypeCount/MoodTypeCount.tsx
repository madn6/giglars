'use client';

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Cell
} from 'recharts';
import { motion } from 'framer-motion';

type MoodTypeCountProps = {
	barChartData: {
		name: string;
		count: number;
	}[];
};

export default function MoodTypeCount({ barChartData }: MoodTypeCountProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className="p-6 rounded-lg border border-border/20 bg-secondary"
		>
			<h3 className="text-sm sm:text-base font-medium mb-4 text-center text-gray-text">
				Mood Type Count
			</h3>
			<ResponsiveContainer width="100%" aspect={2}>
				<BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="4 4" vertical={false} />
					<XAxis dataKey="name" className="text-xs" />
					<YAxis className="text-xs" width={20} />
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
	);
}
