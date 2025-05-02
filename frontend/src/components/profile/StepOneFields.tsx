import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileFormData } from './ProfileForm';
import ProfileLocation from './ProfileLocation';

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
				{...register('uniqueUsername')}
				placeholder="@uniqueUsername"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.uniqueUsername && <p className="text-red-500 text-sm">{errors.uniqueUsername.message}</p>}

			<textarea
				{...register('bio')}
				placeholder="Bio"
				className="w-full border px-3 py-2 rounded"
			/>
			{errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}

			
			<ProfileLocation register={register} errors={errors} />

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
