type Props = {
	feeling: 'lucky' | 'unlucky';
	setFeeling: (value: 'lucky' | 'unlucky') => void;
};

export default function PostFeelingSelector({ feeling, setFeeling }: Props) {
	return (
		<div className="flex items-center gap-2">
			<label className="text-sm">Mood:</label>
			<select
				className="p-1 rounded outline-none bg-gray-800 text-white"
				value={feeling}
				onChange={(e) => setFeeling(e.target.value as 'lucky' | 'unlucky')}
			>
				<option value="lucky">🍀Lucky</option>
				<option value="unlucky">💀Unlucky</option>
			</select>
		</div>
	);
}
