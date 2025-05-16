import { motion } from 'framer-motion';

import {
	EventChart,
	EventGraph,
	EventGrid,
	RecentEvents,
	TodayEntryForm,
	WelcomeGreet
} from '../components';
import MoodTypeCount from '../components/dashboard/MoodTypeCount/MoodTypeCount';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMoodEntries } from '../redux/features/moodEntry/moodEntrySlice';

export default function Dashboard() {
	const dispatch = useAppDispatch();
	const { entries } = useAppSelector((state) => state.moodEntry);

	useEffect(() => {
		dispatch(fetchMoodEntries());
	}, [dispatch]);

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
		<div className="h-full mt-20 text-white max-w-7xl mx-auto p-4">
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto md:gap-3 gap-2"
			>
				<div className="col-span-1 md:col-span-2 lg:col-span-4">
					<WelcomeGreet />
				</div>

				<div className="col-span-1 md:col-span-2 lg:col-span-4">
					<EventGrid />
				</div>

				<div className="col-span-1 md:col-span-1 lg:col-span-2">
					<TodayEntryForm />
				</div>

				<div className="col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-2">
					<RecentEvents />
				</div>

				<div className="col-span-1 md:col-span-2 lg:col-span-2">
					<EventGraph entries={entries} />
				</div>

				<div className="col-span-1 md:col-span-1 lg:col-span-2">
					<EventChart entries={entries} />
				</div>

				<div className="col-span-1 md:col-span-1 lg:col-span-2">
					<MoodTypeCount barChartData={barChartData} />
				</div>
			</motion.div>
		</div>
	);
}
