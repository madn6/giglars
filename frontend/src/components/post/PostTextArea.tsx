type Props = {
	content: string;
	setContent: (value: string) => void;
	maxLength: number;
};

export default function PostTextArea({ content, setContent, maxLength }: Props) {
	return (
		<div>
			<textarea
				className="w-full border border-border rounded-md p-2 bg-transparent outline-none resize-none placeholder:text-gray-400 text-white"
				value={content}
				onChange={(e) => {
					if (e.target.value.length <= maxLength) setContent(e.target.value);
				}}
				placeholder="Share your lucky 🍀 or unlucky 💀 moment..."
				rows={4}
			/>
			<p className="text-right text-xs text-gray-400 mt-1">
				{content.length}/{maxLength}
			</p>
		</div>
	);
}
