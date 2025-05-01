'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const profileSetupSchema = yup.object({
	displayName: yup.string().min(2).max(20).required(),
	username: yup
		.string()
		.matches(/^@[\w_]{3,20}$/, 'Invalid username')
		.required(),
	bio: yup.string().max(160).notRequired(),
	location: yup.string().max(100).notRequired(),
	website: yup.string().url().nullable().notRequired(),
	gender: yup.string().oneOf(['male', 'female', 'other', 'prefer_not_to_say']).required(),
	dob: yup.date().typeError('Please enter a valid date').required(),
	interests: yup.array().of(yup.string().max(30).required()).max(10).optional()
});

type ProfileFormData = yup.InferType<typeof profileSetupSchema>;

interface GenderOption {
	label: string;
	value: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

const genderOptions: GenderOption[] = [
	{ label: 'Male', value: 'male' },
	{ label: 'Female', value: 'female' },
	{ label: 'Other', value: 'other' },
	{ label: 'Prefer not to say', value: 'prefer_not_to_say' }
];

export default function ProfileForm() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch
	} = useForm<ProfileFormData>({
		resolver: yupResolver(profileSetupSchema) as never
	});

	const selectedGenderValue = watch('gender');
	const selectedGender =
		genderOptions.find((g) => g.value === selectedGenderValue) || genderOptions[0];

	const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
		console.log(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
			<input
				{...register('displayName')}
				placeholder="Display Name"
				className="w-full border px-3 py-2 rounded"
			/>
			<p className="text-red-500 text-sm">{errors.displayName?.message}</p>

			<input
				{...register('username')}
				placeholder="@username"
				className="w-full border px-3 py-2 rounded"
			/>
			<p className="text-red-500 text-sm">{errors.username?.message}</p>

			<textarea
				{...register('bio')}
				placeholder="Bio"
				className="w-full border px-3 py-2 rounded"
			/>
			<p className="text-red-500 text-sm">{errors.bio?.message}</p>

			<input
				{...register('location')}
				placeholder="Location"
				className="w-full border px-3 py-2 rounded"
			/>
			<p className="text-red-500 text-sm">{errors.location?.message}</p>

			<input
				{...register('website')}
				placeholder="Website URL"
				className="w-full border px-3 py-2 rounded"
			/>
			<p className="text-red-500 text-sm">{errors.website?.message}</p>

			{/* Headless UI Listbox for Gender */}
			<Listbox value={selectedGender} onChange={(g: GenderOption) => setValue('gender', g.value)}>
				<div className="relative mt-1">
					<ListboxButton className="relative w-full cursor-pointer rounded border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none">
						<span className="block truncate">{selectedGender.label}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
						</span>
					</ListboxButton>
					<ListboxOptions className="absolute z-10 mt-1 w-full rounded bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
						{genderOptions.map((option) => (
							<ListboxOption
								key={option.value}
								value={option}
								className={({ active }) =>
									`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
										active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
									}`
								}
							>
								{({ selected }) => (
									<>
										<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
											{option.label}
										</span>
										{selected ? (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
												<CheckIcon className="h-5 w-5" />
											</span>
										) : null}
									</>
								)}
							</ListboxOption>
						))}
					</ListboxOptions>
				</div>
			</Listbox>
			<p className="text-red-500 text-sm">{errors.gender?.message}</p>

			<input type="date" {...register('dob')} className="w-full border px-3 py-2 rounded" />
			<p className="text-red-500 text-sm">{errors.dob?.message}</p>

			<input
				{...register('interests.0')}
				placeholder="Interest 1"
				className="w-full border px-3 py-2 rounded"
			/>
			<p className="text-red-500 text-sm">{errors.interests?.[0]?.message}</p>

			<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
				Submit
			</button>
		</form>
	);
}
