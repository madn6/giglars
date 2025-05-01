import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

const profileSetupSchema = yup.object({
	displayName: yup
		.string()
		.min(2, 'Display name must be at least 2 characters')
		.max(20, 'Display name must not exceed 20 characters')
		.required('Display name is required'),

	username: yup
		.string()
		.matches(
			/^@[\w_]{3,20}$/,
			'Username must start with @ and contain 3–20 characters (letters, numbers, or underscores)'
		)
		.required('Username is required'),

	bio: yup.string().max(160, 'Bio must not exceed 160 characters').notRequired(),

	location: yup.string().max(100, 'Location must not exceed 100 characters').notRequired(),

	website: yup
		.string()
		.url('Website must be a valid URL (e.g., https://example.com)')
		.nullable()
		.notRequired(),

	gender: yup
		.string()
		.oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender option')
		.required('Gender is required'),

	dob: yup
		.date()
		.typeError('Date of birth must be a valid date')
		.required('Date of birth is required'),

	interests: yup
		.array()
		.of(
			yup
				.string()
				.max(30, 'Each interest must be under 30 characters')
				.required('Interest cannot be empty')
		)
		.max(10, 'You can specify up to 10 interests only')
		.optional()
});

type ProfileFormData = yup.InferType<typeof profileSetupSchema>;

const genderOptions = [
	{ label: 'Please select gender', value: '' },
	{ label: 'Male', value: 'male' },
	{ label: 'Female', value: 'female' },
	{ label: 'Other', value: 'other' },
	{ label: 'Prefer not to say', value: 'prefer_not_to_say' }
] as const;

type GenderOption = (typeof genderOptions)[number];

export default function ProfileForm() {
	const [step, setStep] = useState(1);

	const {
		register,
		handleSubmit,
		control,
		trigger,
		formState: { errors }
	} = useForm<ProfileFormData>({
		resolver: yupResolver(profileSetupSchema) as never,
		mode: 'onChange',
		defaultValues: {
			displayName: '',
			username: '',
			bio: '',
			location: '',
			website: '',
			gender: undefined,
			dob: undefined,
			interests: ['']
		}
	});

	const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
		console.log(data);
	};

	const handleNextStep = async () => {
		// Validate fields for the current step
		const fieldsToValidate: Array<keyof ProfileFormData> =
			step === 1
				? ['displayName', 'username', 'bio', 'location']
				: ['website', 'gender', 'dob', 'interests'];
		const isValid = await trigger(fieldsToValidate);

		if (isValid) {
			setStep((prevStep) => prevStep + 1);
		}
	};

	const handlePreviousStep = () => {
		setStep((prevStep) => prevStep - 1);
	};

	return (
		<div className="h-screen flex items-center font-inter justify-center">
			<div className="w-full max-w-xs px-4">
				<h2 className="text-center text-xl font-semibold mb-2 text-white">Profile Setup</h2>

				{/* Progress Bar */}
				<div className=" w-54  mx-auto">
					<div className="flex items-center justify-between mb-4">
						{/* Step 1 */}
						<div
							className={`h-10 w-10 rounded-full flex items-center justify-center ${
								step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
							} transition-colors`}
						>
							1
						</div>

						{/* Connector */}
						<div
							className={`h-1 flex-1 ${
								step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
							}  transition-colors`}
						></div>

						{/* Step 2 */}
						<div
							className={`h-10 w-10 rounded-full flex items-center justify-center ${
								step >= 2 ? 'bg-blue-600' : 'bg-gray-300 text-blue-600'
							} transition-colors`}
						>
							2
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
					{step === 1 && (
						<>
							<input
								{...register('displayName')}
								placeholder="Display Name"
								className="w-full border px-3 py-2 rounded"
							/>
							{errors.displayName && (
								<p className="text-red-500 text-sm">{errors.displayName.message}</p>
							)}
							<input
								{...register('username')}
								placeholder="@username"
								className="w-full border px-3 py-2 rounded"
							/>

							{errors.username && (
								<p className="text-red-500 text-sm">{errors.username?.message}</p>
							)}

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

							<button
								type="button"
								onClick={handleNextStep}
								className="bg-blue-600 text-white px-4 py-2 rounded w-full"
							>
								Next
							</button>
						</>
					)}

					{step === 2 && (
						<>
							<input
								{...register('website')}
								placeholder="Website URL"
								className="w-full border px-3 py-2 rounded"
							/>
							<p className="text-red-500 text-sm">{errors.website?.message}</p>

							<Controller
								control={control}
								name="gender"
								render={({ field }) => {
									const selectedGender =
										genderOptions.find((option) => option.value === field.value) ||
										genderOptions[0];

									return (
										<Listbox
											value={selectedGender}
											onChange={(g: GenderOption) => field.onChange(g.value)}
										>
											<div className="relative mt-1">
												<ListboxButton className="relative w-full cursor-pointer rounded border py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none">
													<span
														className={`block truncate ${
															selectedGender.value === '' ? 'text-gray-400' : 'text-gray-900'
														}`}
													>
														{selectedGender.label}
													</span>
													<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
														<ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
													</span>
												</ListboxButton>

												<ListboxOptions className="absolute z-10 mt-1 w-full rounded bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
													{genderOptions.map((option) => (
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
																		className={`block truncate ${
																			selected ? 'font-medium' : 'font-normal'
																		}`}
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
							<p className="text-red-500 text-sm">{errors.gender?.message}</p>

							<Controller
								control={control}
								name="dob"
								rules={{ required: 'Date of Birth is required' }}
								render={({ field }) => (
									<DatePicker
										placeholderText="Choose Date of Birth"
										selected={field.value}
										onChange={(date) => field.onChange(date)}
										dateFormat="dd/MM/yyyy"
										className=" w-72 border px-3 py-2 rounded"
									/>
								)}
							/>
							<p className="text-red-500 text-sm">{errors.dob?.message}</p>

							<input
								{...register('interests.0')}
								placeholder="Interests ex:Music, Sports"
								className="w-full border px-3 py-2 rounded"
							/>
							<p className="text-red-500 text-sm">{errors.interests?.[0]?.message}</p>

							<div className="flex justify-between">
								<button
									type="button"
									onClick={handlePreviousStep}
									className="bg-gray-600 text-white px-4 py-2 rounded"
								>
									Back
								</button>
								<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
									Submit
								</button>
							</div>
						</>
					)}
				</form>
			</div>
		</div>
	);
}
