import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { Comment } from '../posts/postTypes';
import { AxiosError } from 'axios';

//toggle like
export const toggleLuckPost = createAsyncThunk<
	{ postId: string; updatedLuckCount: number; userHasLiked: boolean },
	string,
	{ rejectValue: string }
>('interactions/toggleLuckPost', async (postId, { rejectWithValue }) => {
	try {
		const res = await API.patch(
			`/api/luck/toggle-luck-post/${postId}`,
			{},
			{ withCredentials: true }
		);
		return { postId, updatedLuckCount: res.data.luck, userHasLiked: res.data.userHasLiked };
	} catch (err) {
		console.error('Failed to toggle luck:', err);
		return rejectWithValue('Failed to toggle luck on post.');
	}
});

// Create Comment
export const createComment = createAsyncThunk<
	{ postId: string; comment: Comment },
	{ postId: string; content: string },
	{ rejectValue: string }
>('interactions/createComment', async ({ postId, content }, { rejectWithValue }) => {
	try {
		const res = await API.post(
			`/api/comment/post-comment/${postId}`,
			{ content },
			{ withCredentials: true }
		);
		return { postId, comment: res.data };
	} catch (err) {
		console.error('Create comment failed:', err);
		return rejectWithValue('Failed to create comment.');
	}
});

// Get Comments
export const getComments = createAsyncThunk<
	{ postId: string; comments: Comment[] },
	string,
	{ rejectValue: string }
>('interactions/getComments', async (postId, { rejectWithValue }) => {
	try {
		const res = await API.get(`/api/comment/get-comments/${postId}`, { withCredentials: true });
		return { postId, comments: res.data.comments };
	} catch (err) {
		console.error('Failed to fetch comments:', err);
		return rejectWithValue('Failed to load comments.');
	}
});

// Update Comment
export const updateComment = createAsyncThunk<
	{ postId: string; comment: Comment },
	{ postId: string; commentId: string; content: string },
	{ rejectValue: string }
>('interactions/updateComment', async ({ postId, commentId, content }, { rejectWithValue }) => {
	try {
		const res = await API.patch(
			`/api/comment/update-comment/${postId}/${commentId}`,
			{ content },
			{ withCredentials: true }
		);
		return { postId, comment: res.data };
	} catch (err) {
		console.error('Update comment failed:', err);
		return rejectWithValue('Failed to update comment.');
	}
});

// Delete Comment
export const deleteComment = createAsyncThunk<
	{ postId: string; commentId: string },
	{ postId: string; commentId: string },
	{ rejectValue: string }
>('interactions/deleteComment', async ({ postId, commentId }, { rejectWithValue }) => {
	try {
		await API.delete(`/api/comment/delete-comment/${postId}/${commentId}`, {
			withCredentials: true
		});
		return { postId, commentId };
	} catch (err) {
		console.error('Delete comment failed:', err);
		return rejectWithValue('Failed to delete comment.');
	}
});

// interactionThunks.ts
export const reportComment = createAsyncThunk(
	'comments/reportComment',
	async ({ commentId, reason }: { commentId: string; reason: string }, thunkAPI) => {
		try {
			const response = await API.post(`/api/comment/report-comment/${commentId}`, { reason });
			return response.data; 
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			return thunkAPI.rejectWithValue(error.response?.data?.error || 'Unknown error occurred');
		}
	}
);
