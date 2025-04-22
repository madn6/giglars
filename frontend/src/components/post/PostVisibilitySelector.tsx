import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function PostVisibilitySelector() {
	const options = [
		{ name: '🌍 Public', value: 'public' },
		{ name: '🔒 Private', value: 'private' },
		{ name: '👥 Friends Only', value: 'friends' }
	];

	const [selected, setSelected] = useState(options[0]);

	return (
		<div className="flex items-center gap-2 text-xs text-gray-400">
			<span>Visibility:</span>
			<Listbox value={selected} onChange={setSelected}>
				{({ open }) => (
					<div className="relative">
						<ListboxButton className="p-1 pr-2 w-32 rounded bg-gray-800 text-white text-left flex items-center justify-between ">
							{selected.name}
							{open ? (
								<ChevronUp className="w-4 h-4 ml-2" />
							) : (
								<ChevronDown className="w-4 h-4 ml-2" />
							)}
						</ListboxButton>

						<ListboxOptions className="absolute mt-1 w-32 rounded bg-gray-800 shadow-lg z-10">
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
