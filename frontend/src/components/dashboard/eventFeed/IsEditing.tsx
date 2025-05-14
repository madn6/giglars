import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';

type Props = {
	entry: MoodEntry;
	editedEntry: Partial<MoodEntry>;
	setEditedEntry: React.Dispatch<React.SetStateAction<Partial<MoodEntry>>>;
	setEditingEntryId: React.Dispatch<React.SetStateAction<string | null>>;
	handleSave: (id: string) => void;
};

export default function IsEditing({ entry, editedEntry, setEditedEntry ,setEditingEntryId, handleSave}: Props) {
	return (
		<div className="mt-3 space-y-2">
			<textarea
				value={editedEntry.description ?? ''}
				onChange={(e) =>
					setEditedEntry((prev) => ({
						...prev,
						description: e.target.value
					}))
				}
				className="bg-gray focus:outline-none focus:ring-0 border border-border/20 resize-none text-white p-3 rounded-md w-full"
			/>

			<div className="flex gap-3 custom-select-wrapper items-center">
				<select
					value={editedEntry.type ?? 'neutral'}
					onChange={(e) =>
						setEditedEntry((prev) => ({
							...prev,
							type: e.target.value as 'lucky' | 'unlucky' | 'neutral' | undefined
						}))
					}
					className="bg-gray-700 focus:outline-none focus:ring-0  text-white custom-select rounded px-2 py-1"
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
					className="px-3 py-1 text-sm rounded bg-gray-700 text-white"
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
	);
}
