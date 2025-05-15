import { useState } from 'react';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';

type Props = {
	entry: MoodEntry;
	editedEntry: Partial<MoodEntry>;
	setEditedEntry: React.Dispatch<React.SetStateAction<Partial<MoodEntry>>>;
	setEditingEntryId: React.Dispatch<React.SetStateAction<string | null>>;
	handleSave: (id: string) => void;
};

export default function IsEditing({
	entry,
	editedEntry,
	setEditedEntry,
	setEditingEntryId,
	handleSave
}: Props) {
	const [error, setError] = useState<string>('');

	const handleClickSave = () => {
		if (
			editedEntry.type !== 'neutral' &&
			(!editedEntry.description || editedEntry.description.trim() === '')
		) {
			setError('Description is required for Lucky or Unlucky entries.');
			return;
		}

		setError('');
		handleSave(entry._id);
	};

	return (
		<div className="mt-3 space-y-2">
			{editedEntry.type !== 'neutral' && (
				<div className="space-y-1">
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
					{error && <p className="text-red-500 text-sm">{error}</p>}
				</div>
			)}

			<div className="flex gap-3 custom-select-wrapper items-center">
				<select
					value={editedEntry.type ?? 'neutral'}
					onChange={(e) => {
						const newType = e.target.value as 'lucky' | 'unlucky' | 'neutral';

						setEditedEntry((prev) => ({
							...prev,
							type: newType,
							intensity:
								newType === 'neutral'
									? 0
									: prev.intensity && prev.intensity > 0
									? prev.intensity
									: 1, // default to 1 if not previously set
							description: newType === 'neutral' ? '' : prev.description ?? ''
						}));
					}}
					className="bg-gray-700 focus:outline-none focus:ring-0 text-white custom-select rounded px-2 py-1"
				>
					<option value="lucky">Lucky</option>
					<option value="unlucky">Unlucky</option>
					<option value="neutral">Neutral</option>
				</select>

				{editedEntry.type !== 'neutral' && (
					<div className="flex flex-col gap-1 w-full max-w-48">
						<input
							type="range"
							min={1}
							max={3}
							step={1}
							value={editedEntry.intensity ?? 1}
							onChange={(e) =>
								setEditedEntry((prev) => ({
									...prev,
									intensity: parseInt(e.target.value)
								}))
							}
							className="w-full accent-blue-500"
						/>

						{/* Slider Labels */}
						<div className="flex justify-between text-xs text-gray-400 px-1">
							<span>1</span>
							<span>2</span>
							<span>3</span>
						</div>
					</div>
				)}
			</div>

			<div className="flex justify-end gap-2">
				<button
					onClick={() => setEditingEntryId(null)}
					className="px-3 py-1 text-sm rounded bg-gray-700 text-white"
				>
					Cancel
				</button>
				<button
					onClick={handleClickSave}
					className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
				>
					Save
				</button>
			</div>
		</div>
	);
}
