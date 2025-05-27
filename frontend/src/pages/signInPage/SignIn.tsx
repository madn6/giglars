import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import API from '../../utils/axios';

const signInSchema = yup.object().shape({
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup.string().min(8, 'At least 8 characters').required('Password is required')
});

type SignInFormData = {
	email: string;
	password: string;
};

export default function SignIn() {
	const [showPassword, setShowPassword] = useState(false);

	const togglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
		reset
	} = useForm<SignInFormData>({
		resolver: yupResolver(signInSchema)
	});
	const watchPassword = watch('password');

	const onSubmit = async (data: SignInFormData) => {
		try {
			const res = await API.post('/api/auth/login', data, {
				withCredentials: true
			});
			dispatch(
				login({
					userid: res.data.userId,
					profileImage: res.data.profileImage,
					name: res.data.name,
					email: res.data.email
				})
			);
			console.log(res.data.profileImage);
			console.log('login successful', res.data);
			navigate('/');
			toast.success('login successful!', { position: 'bottom-center' });
			reset();
		} catch (error) {
			if (error instanceof AxiosError) {
				// TypeScript now recognizes error.response safely
				toast.error(error.response?.data?.error || 'Login failed!', { position: 'bottom-center' });
			} else {
				toast.error('An unexpected error occurred.', { position: 'bottom-center' });
			}
		}
	};

	return (
		<div className="h-screen flex items-center font-inter justify-center">
			<div className="w-full max-w-xs px-4">
				<h2 className="text-center text-xl font-semibold text-white">Sign In</h2>
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
						<p className="text-red-500 text-sm">{errors.password?.message}</p>
					</div>

					<button
						type="submit"
						className="mt-3 p-3 bg-[#081420] border border-border/30 cursor-pointer text-light-100 rounded-lg text-white disabled:opacity-50"
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
