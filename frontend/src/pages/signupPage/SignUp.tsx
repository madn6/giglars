import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/axios';
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
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const toggleConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev);
	};

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
		reset
	} = useForm<SignUpFormData>({
		resolver: yupResolver(signupSchema)
	});

	const watchPassword = watch('password');
	const watchConfirmPassword = watch('confirmPassword');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (data: SignUpFormData) => {
		try {
			console.log(data);
			const res = await API.post(
				'/api/auth/register',
				{
					username: data.username,
					email: data.email,
					password: data.password,
					confirmPassword: data.confirmPassword
				},
				{
					withCredentials: true
				}
			);
			console.log('user registerd', res.data);
			toast.success('login successful!', { position: 'bottom-center' });
			dispatch(
				login({
					userid: res.data.userId,
					profileImage: res.data.profileImage,
					name: res.data.name,
					email: res.data.email
				})
			);

			navigate('/profile-setup');
			reset();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.error || 'Signup failed!';
				toast.error(errorMessage, { position: 'bottom-center' });
			} else {
				toast.error('An unexpected error occurred.', { position: 'bottom-center' });
			}
		}
	};

	return (
		<div className="h-screen flex items-center font-inter justify-center">
			<div className="w-full max-w-xs px-4">
				<h2 className="text-center text-xl font-semibold text-white">Sign Up</h2>
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

					<div className="relative w-full">
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							className="w-full p-3 text-white rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('password')}
						/>
						{watchPassword && (
							<button
								type="button"
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray"
								onClick={togglePassword}
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						)}
						{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
					</div>

					<div className="relative w-full">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Confirm Password"
							className="w-full p-3 text-white rounded-lg border border-border placeholder:text-white focus:outline-none"
							{...register('confirmPassword')}
						/>
						{watchConfirmPassword && (
							<button
								type="button"
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray"
								onClick={toggleConfirmPassword}
							>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						)}
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
						)}
					</div>

					<button
						type="submit"
						className="mt-3 p-3 bg-[#081420] border border-border/30 cursor-pointer text-light-100 rounded-lg text-white disabled:opacity-50"
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
