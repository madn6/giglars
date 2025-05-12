import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchMoodEntries } from '../../../redux/features/moodEntry/moodEntrySlice';
import { useEffect } from 'react';
import { Clock, Pencil, Trash2 } from 'lucide-react';

export default function RecentEvents() {
	const dispatch = useAppDispatch();
	const { entries } = useAppSelector((state) => state.moodEntry);
	console.log(entries);

	useEffect(() => {
		dispatch(fetchMoodEntries());
	}, [dispatch]);

	return (
		<div
			className={`    p-6 rounded-xl font-inter bg-secondary text-gray-text min-h-[416px] border border-border/20`}
		>
			<div className="flex items-center mb-6 gap-1 justify-center">
				<Clock size={18} />
				<h2 className="text-xl font-semibold text-white">Recent Events</h2>
			</div>

			{entries.length === 0 ? (
				<div className="text-center text-gray-300">No events yet.</div>
			) : (
				<div className={`  space-y-4 max-h-[300px]  overflow-y-auto scrollbar-thin `}>
					{entries
						.slice()
						.reverse()
						.map((entry) => {
							const dateObj = new Date(entry.createdAt);
							const date = dateObj.toLocaleDateString('en-GB', {
								day: 'numeric',
								month: 'short'
							});
							const time = dateObj.toLocaleTimeString('en-US', {
								hour: '2-digit',
								minute: '2-digit'
							});

							const getColor = (type: string, level: number) => {
								if (type === 'lucky') {
									return ['bg-green-500', 'bg-green-700', 'bg-green-900'][level];
								} else if (type === 'unlucky') {
									return ['bg-orange-500', 'bg-orange-700', 'bg-orange-900'][level];
								}
								return 'bg-blue-500';
							};

							const intensityBars =
								entry.type !== 'neutral'
									? Array.from({ length: 3 }, (_, i) => (
											<div
												key={i}
												className={`w-4 h-2 rounded-full ${
													i < entry.intensity ? getColor(entry.type, i) : 'bg-gray'
												}`}
											></div>
									  ))
									: null;

							const getCardStyle = (type: string) => {
								switch (type) {
									case 'lucky':
										return 'bg-green-500/10 border border-green-50';
									case 'unlucky':
										return 'bg-orange-400/10 border border-orange-400';
									case 'neutral':
										return 'bg-blue-400/10 border border-blue-400 ';
									default:
										return '';
								}
							};

							return (
								<div
									key={entry._id}
									className={`  border border-border p-4 rounded-xl ${getCardStyle(entry.type)}`}
								>
									<div className="top flex items-center justify-between gap-2">
										<div className="flex items-center gap-2 text-sm">
											<div className="dot bg-white w-2 h-2 rounded-full"></div>
											<span>{date}</span>
											<span>{time}</span>
										</div>
										<div className="flex gap-2 items-center">
											<Pencil size={18} className="cursor-pointer" />
											<Trash2 size={18} className="cursor-pointer" />
										</div>
									</div>

									<div className="my-3 text-white">{entry.description}</div>
									{entry.type === 'lucky' || entry.type === 'unlucky' ? (
										<div className="bottom flex items-center gap-3 text-sm text-gray-text">
											<span>Intensity:</span>
											<div className="flex items-center gap-2">{intensityBars}</div>
										</div>
									) : (
										<>
											<div className="">Neutral</div>
										</>
									)}
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
}
