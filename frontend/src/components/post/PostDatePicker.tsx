interface PostDatePicker {
	date: Date;
	setDate: (date: Date) => void;
}

export default function PostDatePicker({ date, setDate }:PostDatePicker) {
	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>When did it happen?</span>
			<input
				type="date"
				value={date.toISOString().split('T')[0]}
				className="p-1 w-26 rounded bg-gray-800 text-white outline-none"
				onChange={(e) => setDate(new Date(e.target.value))}
			/>
		</div>
	);
}
