import { Fragment, useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Country, State } from 'country-state-city';
import { ProfileFormData } from './ProfileForm';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface LocationProps {
	register: UseFormRegister<ProfileFormData>;
	errors: FieldErrors<ProfileFormData>;
}

export default function ProfileLocation({ register, errors }: LocationProps) {
	const countries = Country.getAllCountries();
	const [selectedCountry, setSelectedCountry] = useState(countries[0]);
	const [selectedState, setSelectedState] = useState<{ name: string } | null>(null);
	const [states, setStates] = useState(State.getStatesOfCountry(countries[0].isoCode));

	useEffect(() => {
		const updatedStates = State.getStatesOfCountry(selectedCountry.isoCode);
		setStates(updatedStates);
		setSelectedState(updatedStates[0] || null);
	}, [selectedCountry]);

	return (
		<div className="space-y-4">
			{/* Country Selector */}
			<div className="w-full">
				<Listbox value={selectedCountry} onChange={setSelectedCountry}>
					<div className="relative">
						<ListboxButton className="w-full border rounded py-2 px-3 text-left">
							<span className="block truncate">{selectedCountry.name}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
							</span>
						</ListboxButton>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<ListboxOptions className="absolute z-10 mt-1 w-full bg-white border rounded max-h-60 overflow-auto shadow-lg">
								{countries.map((country) => (
									<Listbox.Option key={country.isoCode} value={country} as={Fragment}>
										{({ active, selected }) => (
											<li className={`cursor-pointer px-4 py-2 ${active ? 'bg-gray-100' : ''}`}>
												{selected && <CheckIcon className="inline h-4 w-4 text-green-500 mr-2" />}
												{country.name}
											</li>
										)}
									</Listbox.Option>
								))}
							</ListboxOptions>
						</Transition>
					</div>
				</Listbox>
			</div>

			{/* State Selector */}
			{states.length > 0 && (
				<div className="w-full">
					<Listbox value={selectedState} onChange={setSelectedState}>
						<div className="relative">
							<Listbox.Button className="w-full border rounded py-2 px-3 text-left">
								<span className="block truncate">{selectedState?.name || 'Select State'}</span>
								<span className="absolute inset-y-0 right-0 flex items-center pr-2">
									<ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
								</span>
							</Listbox.Button>
							<Transition
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<ListboxOptions className="absolute z-10 mt-1 w-full bg-white border rounded max-h-60 overflow-auto shadow-lg">
									{states.map((state) => (
										<ListboxOption key={state.isoCode} value={state} as={Fragment}>
											{({ active, selected }) => (
												<li className={`cursor-pointer px-4 py-2 ${active ? 'bg-gray-100' : ''}`}>
													{selected && <CheckIcon className="inline h-4 w-4 text-green-500 mr-2" />}
													{state.name}
												</li>
											)}
										</ListboxOption>
									))}
								</ListboxOptions>
							</Transition>
						</div>
					</Listbox>
				</div>
			)}

			{/* Hidden field to pass final location like "India, Karnataka" to react-hook-form */}
			<input
				type="hidden"
				{...register('location')}
				value={
					selectedCountry && selectedState ? `${selectedCountry.name}, ${selectedState.name}` : ''
				}
			/>

			{/* Error message */}
			{errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
		</div>
	);
}
