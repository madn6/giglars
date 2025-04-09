export default function PostDatePicker() {
	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>When did it happen?</span>
			<input
				type="date"
				className="p-1 rounded bg-gray-800 text-white outline-none"
				onChange={(e) => console.log('Selected Date:', e.target.value)}
			/>
		</div>
	);
}
