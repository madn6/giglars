import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { MoodEntry } from './moodEntryTypes';

interface MoodEntryState {
	entries: MoodEntry[];
	loading: boolean;
	error: string | null;
}

const initialState: MoodEntryState = {
	entries: [],
	loading: false,
	error: null
};

export const fetchMoodEntries = createAsyncThunk(
	'moodEntry/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			const res = await API.get<MoodEntry[]>('/api/dashboard/get-all-entries', { withCredentials: true });
			return res.data;
      } catch (err) {
         console.log(err)
			return rejectWithValue('Failed to fetch mood entries');
		}
	}
);

const moodEntrySlice = createSlice({
	name: 'moodEntry',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMoodEntries.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMoodEntries.fulfilled, (state, action: PayloadAction<MoodEntry[]>) => {
				state.loading = false;
				state.entries = action.payload;
			})
			.addCase(fetchMoodEntries.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	}
});

export default moodEntrySlice.reducer;
