import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import ProfileProgress from './ProfileProgress';
import StepOneFields from './StepOneFields';
import StepTwoFields from './StepTwoFields';
import API from '../../utils/axios';

const profileSetupSchema = yup.object({
	displayName: yup
		.string()
		.min(2, 'Display name must be at least 2 characters')
		.max(20, 'Display name must not exceed 20 characters')
		.required('Display name is required'),

	uniqueUsername: yup
		.string()
		.matches(
			/^@[\w_]{3,20}$/,
			'UniqueUsername must start with @ and contain 3–20 characters (letters, numbers, or underscores)'
		),

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

export type ProfileFormData = yup.InferType<typeof profileSetupSchema>;



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
			uniqueUsername: '',
			bio: '',
			location: '',
			website: '',
			gender: undefined,
			dob: undefined,
			interests: ['']
		}
	});



	const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {

		console.log('Form data:', data); // Debugging line to check form data
		try {
			// Send data to backend for profile setup
			await API.put('/api/profile/profile-setup', data, { withCredentials: true });
			// Handle success (e.g., redirect to another page)
			alert('Profile updated successfully');
		} catch (error) {
			console.error('Profile setup failed', error);
			alert('Failed to update profile');
		}
	};
	

	const handleNextStep = async () => {
		// Validate fields for the current step
		const fieldsToValidate: Array<keyof ProfileFormData> =
			step === 1
				? ['displayName', 'uniqueUsername', 'bio', 'location']
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

				<ProfileProgress step={step} />

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
					{step === 1 && <StepOneFields register={register} errors={errors} onNext={handleNextStep} />}
					{step === 2 && (
						<StepTwoFields
							register={register}
							errors={errors}
							control={control}
							onBack={handlePreviousStep}
						/>
					)}
				</form>
			</div>
		</div>
	);
}
