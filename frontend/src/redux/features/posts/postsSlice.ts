import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { Post, CreatePostPayload } from './postTypes';

interface PostsState {
	postItems: Post[];
	loading: boolean;
	error: string | null;
}

const initialState: PostsState = {
	postItems: [],
	loading: false,
	error: null
};

// Async: Create Post
export const createPost = createAsyncThunk<Post, CreatePostPayload, { rejectValue: string }>(
	'posts/createPost',
	async (payload, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			formData.append('content', payload.content);
			formData.append('feeling', payload.feeling);
			payload.files.forEach((file) => formData.append('files', file));
			formData.append('tags', JSON.stringify(payload.tags));
			formData.append('visibility', payload.visibility);
			formData.append('gifs', JSON.stringify(payload.postGif));

			const res = await API.post('/api/post/create-post', formData, { withCredentials: true });
			return res.data;
		} catch (error) {
			console.error('Failed to create post:', error);
			return rejectWithValue('Failed to create post. Please try again.');
		}
	}
);

// Async: Fetch Posts
export const fetchPosts = createAsyncThunk<
	Post[],
	{ feeling?: 'lucky' | 'unlucky' | 'all' },
	{ rejectValue: string }
>('posts/fetchPosts', async ({ feeling }, { rejectWithValue }) => {
	try {
		const res = await API.get('/api/post/get-all-posts', {
			params: { feeling: feeling === 'all' ? undefined : feeling }
		});

		const sanitized = res.data.posts.map((post: Post) => ({
			...post,
			stats: {
				luck: post.stats?.luck ?? 0,
				comments: post.stats?.comments ?? 0,
				caps: post.stats?.caps ?? 0,
				saves: post.stats?.saves ?? 0,
				shares: post.stats?.shares ?? 0
			}
		}));

		return sanitized;
	} catch (error) {
		console.error('Failed to fetch posts:', error);
		return rejectWithValue('Failed to fetch posts.');
	}
});

// Async: Toggle Luck
export const toggleLuckPost = createAsyncThunk<
	{ postId: string; updatedLuckCount: number },
	string,
	{ rejectValue: string }
>('posts/toggleLuckPost', async (postId, { rejectWithValue }) => {
	try {
		const res = await API.patch(`/api/post/toggle-luck-post/${postId}`, {}, { withCredentials: true });
		return { postId, updatedLuckCount: res.data.luck };
	} catch (err) {
		console.error('Failed to toggle luck:', err);
		return rejectWithValue('Failed to toggle luck on post.');
	}
});

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		setPosts: (state, action: PayloadAction<Post[]>) => {
			state.postItems = action.payload;
		},
		removePost: (state, action: PayloadAction<string>) => {
			state.postItems = state.postItems.filter((post) => post._id !== action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPosts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.loading = false;
				state.postItems = action.payload;
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Unknown error';
			})

			.addCase(createPost.fulfilled, (state, action) => {
				state.postItems.unshift(action.payload);
			})

			.addCase(toggleLuckPost.fulfilled, (state, action) => {
				const post = state.postItems.find((p) => p._id === action.payload.postId);
				if (post && post.stats) {
					post.stats.luck = action.payload.updatedLuckCount;
				}
			});
	}
});

export const { setPosts, removePost } = postsSlice.actions;
export default postsSlice.reducer;
