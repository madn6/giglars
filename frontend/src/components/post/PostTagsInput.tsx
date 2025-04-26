import { useState } from 'react';


type Props = {
	tags: string[];
	setTags: React.Dispatch<React.SetStateAction<string[]>>;
};


export default function PostTagsInput({ tags, setTags }: Props) {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === ' ' || e.key === 'Enter') && inputValue.trim()) {
			const newTags = inputValue
				.trim() //"#lucky#funny#weird"
				.split('#') //["", "lucky", "funny", "weird"]
				.filter((tag) => tag.trim() !== '') //["lucky", "funny", "weird"]
				.map((tag) => `#${tag.trim()}`); //→ ["#lucky", "#funny", "#weird"]
			const uniqeNewTags = newTags.filter((tag) => !tags.includes(tag)); // filter out duplicates from existing tags

			setTags((prev) => [...prev, ...uniqeNewTags]);
			setInputValue('');
			e.preventDefault();
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	return (
		<div className="flex items-center justify-center gap-2 text-xs text-gray-400">
			<span>Tags:</span>
			<div className="flex flex-wrap max-h-16  border border-border overflow-y-auto gap-2 p-2 bg-gray-900 rounded">
				{tags.map((tag) => (
					<span
						key={tag}
						className="bg-gray-700 border border-border text-white text-wrap p-1 rounded cursor-pointer"
						onClick={() => removeTag(tag)}
					>
						{tag}
					</span>
				))}
			</div>
			<input
				type="text"
				placeholder="#luckymoment"
				className="p-1  px-1 w-23  rounded bg-gray-800 placeholder:text-white outline-none"
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				value={inputValue}
			/>
		</div>
	);
}
