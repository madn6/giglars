export default function PostScheduleSelector() {
	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>Schedule Post:</span>
			<input
				type="datetime-local"
				className="p-1 rounded bg-gray-800 text-white outline-none"
				onChange={(e) => console.log('Scheduled for:', e.target.value)}
			/>
		</div>
	);
}
