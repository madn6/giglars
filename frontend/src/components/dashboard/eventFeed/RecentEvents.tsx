import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import {
	fetchMoodEntries,
	deleteMoodEntry,
	updateMoodEntry,
} from '../../../redux/features/moodEntry/moodEntrySlice';
import { Clock, Pencil, Trash2, AlertTriangle } from 'lucide-react';

export default function RecentEvents() {
	const dispatch = useAppDispatch();
	const { entries } = useAppSelector((state) => state.moodEntry);

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
		<div className="p-6 rounded-xl font-inter bg-secondary text-gray-text min-h-[416px] border border-border/20">
			<div className="flex items-center mb-6 gap-1 justify-center">
				<Clock size={18} />
				<h2 className="text-xl font-semibold text-white">Recent Events</h2>
			</div>

			{entries.length === 0 ? (
				<div className="text-center text-gray-300">No events yet.</div>
			) : (
				<div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
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

							const isEditing = editingEntryId === entry._id;
							const isDeleting = confirmDeleteId === entry._id;

							if (isDeleting) {
								return (
									<div
										key={entry._id}
										className="bg-red-600 p-4 rounded-xl text-white border border-red-400"
									>
										<div className="flex items-center mb-2">
											<AlertTriangle className="mr-2" size={18} />
											<span className="font-medium">Confirm deletion</span>
										</div>
										<p className="text-sm mb-3">
											Are you sure you want to delete this event? This action cannot be undone.
										</p>
										<div className="flex justify-end space-x-2">
											<button
												onClick={() => setConfirmDeleteId(null)}
												className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
											>
												Cancel
											</button>
											<button
												onClick={() => handleDelete(entry._id)}
												className="px-3 py-1 bg-white text-red-600 rounded text-sm"
											>
												Delete
											</button>
										</div>
									</div>
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
										<div className="flex items-center gap-2 text-white">
											<div className="w-2 h-2 bg-white rounded-full"></div>
											<span>{date}</span>
											<span>{time}</span>
										</div>
										<div className="flex gap-2 items-center">
											<button onClick={() => handleEdit(entry)}>
												<Pencil size={18} className="hover:text-blue-400" />
											</button>
											<button onClick={() => setConfirmDeleteId(entry._id)}>
												<Trash2 size={18} className="hover:text-red-400" />
											</button>
										</div>
									</div>

									{isEditing ? (
										<div className="mt-3 space-y-2">
											<textarea
												value={editedEntry.description ?? ''}
												onChange={(e) =>
													setEditedEntry((prev) => ({
														...prev,
														description: e.target.value
													}))
												}
												className="bg-gray-800 text-white p-2 rounded w-full"
											/>

											<div className="flex gap-3 items-center">
												<select
													value={editedEntry.type ?? 'neutral'}
													onChange={(e) =>
														setEditedEntry((prev) => ({
															...prev,
															type: e.target.value as "lucky" | "unlucky" | "neutral" | undefined
														}))
													}
													className="bg-gray-700 text-white rounded px-2 py-1"
												>
													<option value="lucky">Lucky</option>
													<option value="unlucky">Unlucky</option>
													<option value="neutral">Neutral</option>
												</select>

												<input
													type="range"
													min={1}
													max={3}
													value={editedEntry.intensity ?? 1}
													onChange={(e) =>
														setEditedEntry((prev) => ({
															...prev,
															intensity: parseInt(e.target.value)
														}))
													}
												/>
											</div>

											<div className="flex justify-end gap-2">
												<button
													onClick={() => setEditingEntryId(null)}
													className="px-3 py-1 text-sm rounded bg-gray-600 text-white"
												>
													Cancel
												</button>
												<button
													onClick={() => handleSave(entry._id)}
													className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
												>
													Save
												</button>
											</div>
										</div>
									) : (
										<div className="my-3 text-white">{entry.description}</div>
									)}

									{entry.type === 'lucky' || entry.type === 'unlucky' ? (
										<div className="flex items-center gap-3 text-sm text-gray-text">
											<span>Intensity:</span>
											<div className="flex items-center gap-2">{intensityBars}</div>
										</div>
									) : (
										<div className="text-white">Neutral</div>
									)}
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
}
