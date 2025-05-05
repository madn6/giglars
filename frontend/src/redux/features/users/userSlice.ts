import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserState } from './userTypes';
import API from '../../../utils/axios';

const initialState: UserState = {
	displayName: '',
	email: '',
	loading: false,
	error: null
};

export const updateUser = createAsyncThunk(
	'user/update',
	async (
		userData: { displayName: string; email: string; password?: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await API.put('/api/profile/profile-update', userData, { withCredentials: true });
			return res.data.user;
		} catch (err) {
			console.log(err);
			return rejectWithValue('Failed to update user');
		}
	}
);

export const getProfileData = createAsyncThunk(
	'user/getProfileData',
	async (_, { rejectWithValue }) => {
		try {
			const res = await API.get('/api/profile/get-profile-data', { withCredentials: true });
			return res.data.user;
		} catch (err) {
			console.log(err);
			return rejectWithValue('Failed to fetch profile data');
		}
	}
);

// getProfileData = "Fetch my info from the server when the page opens."
// updateUser = "Send updated info to the server when I click save."

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<{ displayName: string; email: string }>) => {
			state.displayName = action.payload.displayName;
			state.email = action.payload.email;
		},
		clearUser: (state) => {
			state.displayName = '';
			state.email = '';
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.loading = false;
				state.displayName = action.payload.displayName;
				state.email = action.payload.email;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			.addCase(getProfileData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getProfileData.fulfilled, (state, action) => {
				state.loading = false;
				state.displayName = action.payload.displayName;
				state.email = action.payload.email;
			})
			.addCase(getProfileData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	}
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
