import { useDispatch, useSelector } from 'react-redux';
import { Pencil } from 'lucide-react';

import {
	updateUser,
	clearUser,
	getProfileData,
	updateUserProfileImage
} from '../redux/features/users/userSlice';
import { logout } from '../redux/features/auth/authSlice';
import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store/store';

export default function UpdateProfile() {
	const displayName = useSelector((state: RootState) => state.users.displayName);
	const email = useSelector((state: RootState) => state.users.email);
	const loading = useSelector((state: RootState) => state.users.loading);
	const error = useSelector((state: RootState) => state.users.error);
	const profileImage = useSelector((state: RootState) => state.auth.profileImage);

	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		displayName: displayName || '',
		email: email || '',
		password: ''
	});

	useEffect(() => {
		dispatch(getProfileData());
	}, [dispatch]);

	useEffect(() => {
		setFormData({
			displayName: displayName || '',
			email: email || '',
			password: ''
		});
	}, [displayName, email]);

	const [message, setMessage] = useState('');

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await dispatch(updateUser(formData));
		if (updateUser.fulfilled.match(result)) {
			setMessage('Profile updated successfully');
		} else {
			setMessage('Update failed');
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleDeleteAccount = async () => {
		await API.delete('/api/profile/delete-account', { withCredentials: true });
		dispatch(clearUser());
		navigate('/sign-up');
	};

	const handleSignOut = async () => {
		await API.post('/api/profile/logout', {}, { withCredentials: true });
		dispatch(logout());
		navigate('/log-in');
	};

	const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		dispatch(updateUserProfileImage(file));
	};

	return (
		<div className="h-screen flex items-center font-inter justify-center">
			<div className="w-full max-w-xs px-4">
				<h2 className="text-center text-xl font-semibold text-white">Edit Profile</h2>
				<div className="flex items-center justify-center mt-2">
					<div className="relative w-24 h-24">
						{profileImage && (
							<img
								src={profileImage}
								alt="Profile"
								className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
								onClick={() => document.getElementById('profileImageInput')?.click()}
							/>
						)}

						{/* Pencil Icon - Decorative Only */}
						<div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow">
							<Pencil size={16} />
						</div>

						{/* Hidden File Input */}
						<input
							type="file"
							id="profileImageInput"
							accept="image/*"
							onChange={handleProfileImageUpload}
							className="hidden"
						/>
					</div>
				</div>

				<form onSubmit={handleUpdate} className="flex flex-col gap-3 mt-4">
					<input
						name="displayName"
						type="text"
						value={formData.displayName}
						onChange={handleChange}
						className="w-full text-white p-3 rounded-lg border border-border placeholder:text-white focus:outline-none"
					/>
					<input
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full text-white p-3 rounded-lg border border-border placeholder:text-white focus:outline-none"
					/>
					<input
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="New Password (optional)"
						type="password"
						className="w-full text-white p-3 rounded-lg border border-border placeholder:text-white focus:outline-none"
					/>
					<button
						type="submit"
						disabled={loading}
						className="w-full text-white p-3 rounded-lg border border-border placeholder:text-white focus:outline-none"
					>
						{loading ? 'Updating...' : 'Update'}
					</button>

					{message && <p className="text-green-500 text-sm mt-2">{message}</p>}
					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div className="flex items-center justify-between mt-4">
						<button onClick={handleDeleteAccount} className="text-red-600">
							Delete Account
						</button>
						<button onClick={handleSignOut} className="text-blue-500">
							Sign Out
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
