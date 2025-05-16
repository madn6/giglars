import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import {
	fetchMoodEntries,
	deleteMoodEntry,
	updateMoodEntry
} from '../../../redux/features/moodEntry/moodEntrySlice';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import IsEditing from './IsEditing';
import IsDeleting from './isDeleting';

export default function RecentEvents() {
	const dispatch = useAppDispatch();
	const { entries } = useAppSelector((state) => state.moodEntry);
	console.log(entries);

	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
	const [editedEntry, setEditedEntry] = useState<Partial<MoodEntry>>({});

	useEffect(() => {
		dispatch(fetchMoodEntries());
	}, [dispatch]);

	const handleDelete = async (id: string) => {
		await dispatch(deleteMoodEntry(id));
		setConfirmDeleteId(null);
	};

	const handleEdit = (entry: MoodEntry) => {
		setEditingEntryId(entry._id);
		setEditedEntry({
			description: entry.description,
			type: entry.type,
			intensity: entry.intensity
		});
	};

	const handleSave = async (id: string) => {
		await dispatch(updateMoodEntry({ id, updatedEntry: editedEntry }));
		setEditingEntryId(null);
		setEditedEntry({});
	};

	const getColor = (type: string, level: number) => {
		if (type === 'lucky') return ['bg-green-500', 'bg-green-700', 'bg-green-900'][level];
		if (type === 'unlucky') return ['bg-orange-500', 'bg-orange-700', 'bg-orange-900'][level];
		return 'bg-blue-500';
	};

	const getCardStyle = (type: string) => {
		switch (type) {
			case 'lucky':
				return 'bg-green-400/20 border border-green-400';
			case 'unlucky':
				return 'bg-orange-400/20 border border-orange-400';
			case 'neutral':
				return 'bg-blue-400/20 border border-blue-400';
			default:
				return '';
		}
	};

	return (
		<div className="p-6 rounded-xl font-inter bg-secondary text-gray-text h-full border border-border/20">
			<div className="flex items-center mb-6 text-white gap-1 justify-center">
				<Clock size={20} />
				<h2 className="text-xl font-semibold ">Recent Events</h2>
			</div>

			{entries.length === 0 ? (
				<div className="text-center text-gray-300">No events yet.</div>
			) : (
				<div className="space-y-4 lg:h-[760px] md:h-[300px] h-[300px] overflow-y-auto scrollbar-thin">
					{entries.map((entry) => {
						const dateObj = new Date(entry.createdAt);
						const date = dateObj.toLocaleDateString('en-GB', {
							day: 'numeric',
							month: 'short'
						});
						const isToday = new Date(entry.createdAt).toDateString() === new Date().toDateString();

						const time = dateObj.toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit'
						});

						const isEditing = editingEntryId === entry._id;
						const isDeleting = confirmDeleteId === entry._id;

						if (isDeleting) {
							return (
								<IsDeleting
									entry={entry}
									setConfirmDeleteId={setConfirmDeleteId}
									handleDelete={handleDelete}
								/>
							);
						}

						const intensityBars =
							entry.type !== 'neutral'
								? Array.from({ length: 3 }, (_, i) => (
										<div
											key={i}
											className={`w-4 h-2 rounded-full ${
												i < (isEditing ? editedEntry.intensity ?? 0 : entry.intensity)
													? getColor(entry.type, i)
													: 'bg-gray'
											}`}
										></div>
								  ))
								: null;

						return (
							<div
								key={entry._id}
								className={`shadow-2xl p-4 rounded-xl ${getCardStyle(entry.type)}`}
							>
								<div className="flex justify-between items-center text-sm">
									<div className="flex items-center text-xs md:text-sm gap-1 text-white">
										<div className="w-2 h-2 bg-white rounded-full"></div>
										<span>{date}</span>
										<span>{time}</span>
									</div>
									{entry.updatedAt &&
										entry.createdAt &&
										new Date(entry.updatedAt).getTime() !== new Date(entry.createdAt).getTime() && (
											<div className="text-xs text-gray-text">
												Updated at{' '}
												{new Date(entry.updatedAt).toLocaleTimeString([], {
													hour: 'numeric',
													minute: '2-digit',
													hour12: true
												})}
											</div>
										)}

									{isToday && (
										<div className="flex gap-2 items-center">
											<button onClick={() => handleEdit(entry)}>
												<Pencil size={18} className="hover:text-blue-400" />
											</button>
											<button onClick={() => setConfirmDeleteId(entry._id)}>
												<Trash2 size={18} className="hover:text-red-400" />
											</button>
										</div>
									)}
								</div>

								{isEditing ? (
									<IsEditing
										entry={entry}
										editedEntry={editedEntry}
										setEditedEntry={setEditedEntry}
										setEditingEntryId={setEditingEntryId}
										handleSave={handleSave}
									/>
								) : (
									<>
										<div className="my-3 text-white">{entry.description}</div>
									</>
								)}

								{(entry.type === 'lucky' || entry.type === 'unlucky') && (
									<div className="flex items-center gap-3 text-sm text-gray-text">
										<span>Intensity:</span>
										<div className="flex items-center gap-2">{intensityBars}</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
