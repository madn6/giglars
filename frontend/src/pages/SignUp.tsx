import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ✅ Validation Schema
const signupSchema = yup.object().shape({
	username: yup
		.string()
		.min(3, 'At least 3 characters')
		.max(20, 'Max 20 characters')
		.matches(/^[a-zA-Z0-9]+$/, 'No special characters')
		.required('Username is required'),
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup
		.string()
		.min(8, 'At least 8 characters')
		.matches(/[a-zA-Z]/, 'Must include a letter')
		.matches(/[0-9]/, 'Must include a number')
		.required('Password is required'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm Password is required')
});

type SignUpFormData = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};



export default function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm({
		resolver: yupResolver(signupSchema)
	});

	const onSubmit = async (data: SignUpFormData) => {
		console.log('Signing up...', data);
	};

	return (
		<div className="h-screen flex items-center font-inter justify-center">
			<div className="w-full max-w-xs px-4">
				<h2 className="text-center text-xl font-bold dark:text-light-100">Sign Up</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-4">
					<div>
						<input
							type="text"
							placeholder="Username"
							className="w-full text-white p-3 rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('username')}
						/>
						{errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
					</div>

					<div>
						<input
							type="email"
							placeholder="Email"
							className="w-full text-white p-3 rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('email')}
						/>
						{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
					</div>

					<div>
						<input
							type="password"
							placeholder="Password"
							className="w-full p-3 text-white rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('password')}
						/>
						{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
					</div>

					<div>
						<input
							type="password"
							placeholder="Confirm Password"
							className="w-full p-3 text-white rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('confirmPassword')}
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
						)}
					</div>

					<button
						type="submit"
						className="mt-3 p-3 bg-[#121212] border border-border/20 cursor-pointer text-light-100 rounded-lg text-white transition disabled:opacity-50"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Loading...' : 'Sign Up'}
					</button>
				</form>
				<p className="text-center text-white text-sm mt-3">
					Already have an account?{' '}
					<Link to="/sign-in" className="text-blue-700 ml-2 hover:underline">
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
