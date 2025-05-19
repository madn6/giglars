import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { MoodEntry } from './moodEntryTypes';

interface MoodEntryState {
	entries: MoodEntry[];
	sevenDayEntries: MoodEntry[];
	loading: boolean;
	error: string | null;
}

const initialState: MoodEntryState = {
	entries: [],
	sevenDayEntries: [],
	loading: false,
	error: null
};

export const fetchMoodEntries = createAsyncThunk(
	'moodEntry/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			const res = await API.get<MoodEntry[]>('/api/dashboard/get-all-entries', {
				withCredentials: true
			});
			return res.data;
		} catch (err) {
			console.log(err);
			return rejectWithValue('Failed to fetch mood entries');
		}
	}
);

export const deleteMoodEntry = createAsyncThunk(
	'moodEntry/deleteMoodEntry',
	async (entryId: string, thunkAPI) => {
		try {
			await API.delete(`/api/dashboard/delete-entry/${entryId}`);
			return entryId;
		} catch (err) {
			console.log(err);
			return thunkAPI.rejectWithValue('Failed to delete mood entry');
		}
	}
);

export const updateMoodEntry = createAsyncThunk(
	'moodEntry/update',
	async ({ id, updatedEntry }: { id: string; updatedEntry: Partial<MoodEntry> }, thunkAPI) => {
		try {
			const response = await API.put(`/api/dashboard/update-entry/${id}`, updatedEntry, {
				withCredentials: true
			});
			return response.data;
		} catch (error) {
			console.log(error);
			return thunkAPI.rejectWithValue('Failed to update mood entry');
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
			})
			.addCase(deleteMoodEntry.fulfilled, (state, action) => {
				state.entries = state.entries.filter((entry) => entry._id !== action.payload);
			})
			.addCase(updateMoodEntry.fulfilled, (state, action: PayloadAction<MoodEntry>) => {
				state.entries = state.entries.map((entry) =>
					entry._id === action.payload._id ? action.payload : entry
				);
			});
	}
});

export default moodEntrySlice.reducer;
