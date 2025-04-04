import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
	isLoggedIn: boolean;
	userId: string | null;
	profileImage: string;
}

const initialState: AuthState = {
	isLoggedIn: false,
	userId: null,
	profileImage: '/images/dummyUser.jpg'
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (
			state,
			action: PayloadAction<{ userid: string; profileImage: string | null }>
		) => {
			state.isLoggedIn = true;
			state.userId = action.payload.userid;
			state.profileImage = action.payload.profileImage || '/images/dummyUser.jpg';
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.userId = null;
			state.profileImage = '/images/dummyUser.jpg';
		}
	}
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
