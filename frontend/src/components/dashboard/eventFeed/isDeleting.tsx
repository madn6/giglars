import { AlertTriangle } from 'lucide-react';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';

type Props = {

   entry: MoodEntry;
   setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
   handleDelete: (id: string) => void;
};

export default function isDeleting({entry,setConfirmDeleteId,handleDelete}: Props) {
	return (
		<div key={entry._id} className="bg-red-500/20  p-4 rounded-xl text-white border border-red-500">
			<div className="flex items-center mb-2">
				<AlertTriangle className="mr-2 text-amber-400" size={18} />
				<span className="font-medium text-amber-200">Confirm deletion</span>
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
					className="px-3 py-1 bg-red-600 text-white rounded text-sm"
				>
					Delete
				</button>
			</div>
		</div>
	);
}
