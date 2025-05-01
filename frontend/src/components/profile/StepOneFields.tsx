import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileFormData } from './ProfileForm';

interface StepOneProps {
	register: UseFormRegister<ProfileFormData>;
	errors: FieldErrors<ProfileFormData>;
   onNext: () => void;
}

export default function StepOne({ register, errors, onNext }: StepOneProps) {
	return (
		<>
			<input
				{...register('displayName')}
				placeholder="Display Name"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.displayName && <p className="text-red-500 text-sm">{errors.displayName.message}</p>}

			<input
				{...register('username')}
				placeholder="@username"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

			<textarea
				{...register('bio')}
				placeholder="Bio"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}

			<input
				{...register('location')}
				placeholder="Location"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

			<button
				type="button"
				onClick={onNext}
				className="bg-blue-600 text-white px-4 py-2 rounded w-full"
			>
				Next
			</button>
		</>
	);
}
