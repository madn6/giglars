import API from '../utils/axios';
import { AppDispatch } from '../redux/store/store'; // update with actual store path
import { login, logout } from '../redux/features/auth/authSlice';
import { NavigateFunction } from 'react-router-dom';

interface UserData {
	userId: string;
	profileImage: string;
	name: string;
	email: string;
}

export const checkAuth = async (
	dispatch: AppDispatch,
	navigate: NavigateFunction
): Promise<void> => {
	console.log('this is api', API);
	try {
		const res = await API.get<UserData>('/api/auth/check-auth', { withCredentials: true });

		dispatch(
			login({
				userid: res.data.userId,
				profileImage: res.data.profileImage,
				name: res.data.name,
				email: res.data.email
			})
		);
	} catch {
		try {
			await API.post('/api/auth/refresh', {}, { withCredentials: true });

			const retryRes = await API.get<UserData>('/api/auth/check-auth', { withCredentials: true });
			dispatch(
				login({
					userid: retryRes.data.userId,
					profileImage: retryRes.data.profileImage,
					name: retryRes.data.name,
					email: retryRes.data.email
				})
			);
		} catch {
			dispatch(logout());
			navigate('/sign-in');
		}
	}
};
