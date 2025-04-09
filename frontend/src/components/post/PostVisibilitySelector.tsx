

export default function PostVisibilitySelector() {
	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>Visibility:</span>
			<select
				className="p-1 rounded outline-none bg-gray-800 text-white"
				onChange={(e) => console.log('Visibility:', e.target.value)}
			>
				<option value="public">🌍 Public</option>
				<option value="private">🔒 Private</option>
				<option value="friends">👥 Friends Only</option>
			</select>
		</div>
	);
}
