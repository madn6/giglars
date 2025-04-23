import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

type Props = {
	feeling: 'lucky' | 'unlucky';
	setFeeling: (value: 'lucky' | 'unlucky') => void;
};

export default function PostFeelingSelector({ feeling, setFeeling }: Props) {
	const options = [
		{ name: '🍀 Lucky', value: 'lucky' },
		{ name: '💀 Unlucky', value: 'unlucky' }
	];

	// Set initial selected value based on the feeling prop
	const [selected, setSelected] = useState(options.find((option) => option.value === feeling));

	const handleChange = (option: { value: 'lucky' | 'unlucky'; name: string }) => {
		setSelected(option);
		setFeeling(option.value); // Update the parent component's feeling state
	};

	return (
		<div className="flex items-center text-sm gap-2">
			<span className="text-sm">Mood:</span>
			<Listbox value={selected} onChange={handleChange}>
				{({ open }) => (
					<div className="relative">
						<ListboxButton className="p-1 pr-2 w-28 rounded bg-gray-800 text-white text-left flex items-center justify-between">
							{selected?.name}
							{open ? (
								<ChevronUp className="w-4 h-4 ml-2" />
							) : (
								<ChevronDown className="w-4 h-4 ml-2" />
							)}
						</ListboxButton>

						<ListboxOptions className="absolute mt-1 w-28 rounded bg-gray-800 shadow-lg z-10">
							{options.map((option) => (
								<ListboxOption
									key={option.value}
									value={option}
									className="px-3 py-1 text-white hover:bg-gray-700 cursor-pointer"
								>
									{option.name}
								</ListboxOption>
							))}
						</ListboxOptions>
					</div>
				)}
			</Listbox>
		</div>
	);
}
