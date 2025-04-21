interface PostScheduleSelectorProps {
	scheduledDate: Date;
	setScheduledDate: (date: Date) => void;
}

export default function PostScheduleSelector({
	scheduledDate,
	setScheduledDate
}: PostScheduleSelectorProps) {
	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>Schedule Post:</span>
			<input
				type="datetime-local"
				value={scheduledDate.toISOString().slice(0, 16)}
				className="p-1 w-38 rounded bg-gray-800 text-white outline-none"
				onChange={(e) => setScheduledDate(new Date(e.target.value))}
			/>
		</div>
	);
}
