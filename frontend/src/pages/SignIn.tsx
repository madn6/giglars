import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define validation schema
const signInSchema = yup.object().shape({
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
});

type SignInFormData = {
	email: string;
	password: string;
};

export default function SignIn() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormData>({
		resolver: yupResolver(signInSchema),
	});

	const onSubmit = async (data: SignInFormData) => {
		console.log('Signing in...', data);
		// Simulating API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	return (
		<div className="h-screen flex items-center font-inter justify-center">
			<div className="w-full max-w-xs px-4">
				<h2 className="text-center text-xl font-bold dark:text-light-100">Sign In</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-4">
					<div>
						<input
							type="email"
							placeholder="Email"
							className="w-full text-white p-3 rounded-lg placeholder:text-white border border-border focus:outline-none"
							{...register('email')}
						/>
						<p className="text-red-500 text-sm">{errors.email?.message}</p>
					</div>

					<div>
						<input
							type="password"
							placeholder="Password"
							className="w-full p-3 text-white rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('password')}
						/>
						<p className="text-red-500 text-sm">{errors.password?.message}</p>
					</div>

					<button
						type="submit"
						className="mt-3 p-3 bg-[#121212] border border-border/20 cursor-pointer text-light-100 rounded-lg text-white transition disabled:opacity-50"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Loading...' : 'Sign In'}
					</button>
				</form>

				<p className="text-center text-white text-sm mt-3">
					Don't have an account?{' '}
					<Link to="/sign-up" className="text-blue-700 ml-2 hover:underline">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
