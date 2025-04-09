
export default function PostGifSelector() {
	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>Add GIF:</span>
			<button
				type="button"
				onClick={() => console.log('GIF Picker Modal Open')}
				className="p-1 rounded bg-gray-800 text-white hover:bg-gray-700"
			>
				Open GIF Picker
			</button>
		</div>
	);
}
