type props = {
	isAnonymous: boolean;
	handleToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PostAnonymousToggle({ isAnonymous, handleToggle }: props) {
	return (
		<div className="flex items-center gap-3  text-xs text-gray-400">
			<span>Post as Anonymous:</span>
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={isAnonymous}
					onChange={handleToggle}
				/>
				<div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-500 transition-all"></div>
				<div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform"></div>
			</label>
		</div>
	);
}
