import { UseFormRegister, FieldErrors, Controller, Control } from 'react-hook-form';
import { ProfileFormData } from './ProfileForm';
import DatePicker from 'react-datepicker';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface StepTwoProps {
	register: UseFormRegister<ProfileFormData>;
	errors: FieldErrors<ProfileFormData>;
	control: Control<ProfileFormData>;
	onBack: () => void;
}

const genderOptions = [
	{ label: 'Please select gender', value: '' },
	{ label: 'Male', value: 'male' },
	{ label: 'Female', value: 'female' },
	{ label: 'Other', value: 'other' },
	{ label: 'Prefer not to say', value: 'prefer_not_to_say' }
];

export default function StepTwoFields({ register, errors, control, onBack }: StepTwoProps) {
	return (
		<>
			<input
				{...register('website')}
				placeholder="Website URL"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.website && <p className="text-red-500 text-sm">{errors.website?.message}</p>}

			<Controller
				control={control}
				name="gender"
				render={({ field }) => {
					const selectedGender =
						genderOptions.find(
							(option: (typeof genderOptions)[number]) => option.value === field.value
						) || genderOptions[0];

					return (
						<Listbox
							value={selectedGender}
							onChange={(g: (typeof genderOptions)[number]) => field.onChange(g.value)}
						>
							<div className="relative mt-1">
								<ListboxButton className="relative w-full cursor-pointer rounded border py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none">
									<span
										className={`block truncate ${
											selectedGender.value === '' ? 'text-gray-400' : 'text-white'
										}`}
									>
										{selectedGender.label}
									</span>
									<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
										<ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
									</span>
								</ListboxButton>

								<ListboxOptions className="absolute z-10 mt-1 w-full rounded bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
									{genderOptions.map((option: (typeof genderOptions)[number]) => (
										<ListboxOption
											key={option.value}
											value={option}
											disabled={option.value === ''}
											className={({ active, disabled }) =>
												`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
													disabled
														? 'text-gray-400 cursor-not-allowed'
														: active
														? 'bg-blue-100 text-blue-900'
														: 'text-gray-900'
												}`
											}
										>
											{({ selected }) => (
												<>
													<span
														className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
													>
														{option.label}
													</span>
													{selected && option.value !== '' && (
														<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
															<CheckIcon className="h-5 w-5" />
														</span>
													)}
												</>
											)}
										</ListboxOption>
									))}
								</ListboxOptions>
							</div>
						</Listbox>
					);
				}}
			/>
			{errors.gender && <p className="text-red-500 text-sm">{errors.gender?.message}</p>}

			<Controller
				control={control}
				name="dob"
				render={({ field }) => (
					<DatePicker
						placeholderText="Choose Date of Birth"
						selected={field.value}
						onChange={(date) => field.onChange(date)}
						dateFormat="dd/MM/yyyy"
						className="w-72 border px-3 py-2 rounded"
					/>
				)}
			/>
			{errors.dob && <p className="text-red-500 text-sm">{errors.dob?.message}</p>}

			<input
				{...register('interests.0')}
				placeholder="Interests (e.g., Music, Sports)"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.interests?.[0] && (
				<p className="text-red-500 text-sm">{errors.interests?.[0]?.message}</p>
			)}

			<div className="flex justify-between">
				<button type="button" onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">
					Back
				</button>
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
					Submit
				</button>
			</div>
		</>
	);
}
