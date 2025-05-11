import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TodayEntryState } from './todayEntryTypes';
import API from '../../../utils/axios';

const initialState: TodayEntryState = {
	loading: false,
	error: null,
	success: false
};

export const submitTodayEntry = createAsyncThunk(
	'todayEntry/submit',
	async (
		formData: { type: string; description: string; intensity: number },
		{ rejectWithValue }
	) => {
		try {
			await API.post('/api/dashboard/new-entry', formData, {
				withCredentials:true
			});
			console.log('form data',formData)
		} catch (err) {
			console.log(err);
			return rejectWithValue('something went wrong');
		}
	}
);

const todayEntrySlice = createSlice({
	name: 'todayEntry',
	initialState,
	reducers: {
		resetTodayEventState: (state) => {
			state.loading = false;
			state.error = null;
			state.success = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(submitTodayEntry.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(submitTodayEntry.fulfilled, (state) => {
				state.loading = false;
				state.success = true;
			})
			.addCase(submitTodayEntry.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	}
});


export const { resetTodayEventState } = todayEntrySlice.actions
export default todayEntrySlice.reducer