import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './authTypes';


const initialState: AuthState = {
	isLoggedIn: false,
	userId: null,
	profileImage: '/images/dummyUser.jpg',
	email: null,
	name: null
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (
			state,
			action: PayloadAction<{
				userid: string;
				profileImage: string | null;
				email: string;
				name: string;
			}>
		) => {
			state.isLoggedIn = true;
			state.userId = action.payload.userid;
			state.profileImage = action.payload.profileImage || '/images/dummyUser.jpg';
			state.email = action.payload.email;
			state.name = action.payload.name;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.userId = null;
			state.email = null;
			state.name = null;
		}
		
	}
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
