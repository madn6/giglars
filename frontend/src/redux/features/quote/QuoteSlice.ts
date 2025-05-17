import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { QuoteState } from './QuoteSliceTypes';
import { fallbackQuotes } from './fallbackQuotes';

const initialState: QuoteState = {
	text: '',
	author: '',
	loading: false,
	error: null
};

export const fetchQuotes = createAsyncThunk(
  'quote/fetchQuote',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Try ZenQuotes first
      const zenRes = await API.get('/api/quotes/quote');
      const zenData = zenRes.data;

      if (!zenData[0]?.q) throw new Error('ZenQuotes returned no quote');

      return {
        text: zenData[0].q,
        author: zenData[0].a || 'Unknown',
      };
    } catch {
     try {
        // Use fallback quotes
        const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        return {
          text: random.text,
          author: random.author || 'Unknown',
        };
      } catch {
        return rejectWithValue('Failed to fetch quote and fallback');
      }
    }
  }
);

const quoteSlice = createSlice({
	name: 'quote',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchQuotes.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(fetchQuotes.fulfilled, (state, action) => {
			state.loading = false;
			state.text = action.payload.text;
			state.author = action.payload.author;
		});
		builder.addCase(fetchQuotes.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as string) || 'Failed to fetch quote';
		});
	}
});

export default quoteSlice.reducer;
