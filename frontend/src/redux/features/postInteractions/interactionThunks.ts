import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../utils/axios';

export const toggleLuckPost = createAsyncThunk<
	{ postId: string; updatedLuckCount: number },
	string,
	{ rejectValue: string }
>('interactions/toggleLuckPost', async (postId, { rejectWithValue }) => {
	try {
		const res = await API.patch(
			`/api/luck/toggle-luck-post/${postId}`,
			{},
			{ withCredentials: true }
		);
		return { postId, updatedLuckCount: res.data.luck };
	} catch (err) {
		console.error('Failed to toggle luck:', err);
		return rejectWithValue('Failed to toggle luck on post.');
	}
});
