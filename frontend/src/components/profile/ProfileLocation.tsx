import { Fragment, useMemo, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { Country, State } from 'country-state-city';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileFormData } from './ProfileForm';

interface LocationProps {
	register: UseFormRegister<ProfileFormData>;
	errors: FieldErrors<ProfileFormData>;
}

export default function ProfileLocation({ register, errors }: LocationProps) {
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState('');

	// Memoize all "Country, State" pairs
	const locations = useMemo(() => {
		const list: string[] = [];
		const countries = Country.getAllCountries();

		countries.forEach((country) => {
			const states = State.getStatesOfCountry(country.isoCode);
			if (states.length) {
				states.forEach((state) => list.push(`${country.name}, ${state.name}`));
			} else {
				list.push(`${country.name}`);
			}
		});

		return list;
	}, []);

	// Filter matches (case-insensitive)
	const filtered = query === ''
		? locations
		: locations.filter((loc) =>
				loc.toLowerCase().includes(query.toLowerCase())
		);

	return (
		<div className="w-full">
			<Combobox value={selected} onChange={(val) => {
				setSelected(val ?? "");
				setQuery(val ?? '');
			}}>
				<div className="relative">
					{/* Input */}
					<div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
						<ComboboxInput
							{...register('location')}
							className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
							displayValue={() => query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Select your location (e.g. India, Tamil Nadu)"
						/>
						<ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
						</ComboboxButton>
					</div>

					{/* Dropdown */}
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 shadow-lg ring-1 ring-black/5 text-sm">
							{filtered.length === 0 ? (
								<div className="cursor-default select-none px-4 py-2 text-gray-700">
									No locations found.
								</div>
							) : (
								filtered.slice(0, 100).map((loc, idx) => (
									<ComboboxOption
										key={idx}
										value={loc}
										className={({ active }) =>
											`cursor-default select-none relative py-2 pl-10 pr-4 ${
												active ? 'bg-indigo-600 text-white' : 'text-gray-900'
											}`
										}
									>
										{({ selected, active }) => (
											<>
												<span
													className={`block truncate ${
														selected ? 'font-medium' : 'font-normal'
													}`}
												>
													{loc}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
															active ? 'text-white' : 'text-indigo-600'
														}`}
													>
														<CheckIcon className="h-5 w-5" />
													</span>
												) : null}
											</>
										)}
									</ComboboxOption>
								))
							)}
						</ComboboxOptions>
					</Transition>
				</div>
			</Combobox>

			{/* Error Message */}
			{errors.location && (
				<p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
			)}
		</div>
	);
}
