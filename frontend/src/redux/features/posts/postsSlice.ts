import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { Post } from './postTypes'; // Import the Post type

// Initial state
const initialState: Post[] = [];

// Async thunk to create a post
export const createPost = createAsyncThunk(
	'posts/createPost',
	async (
		{
			content,
			feeling,
			files,
			tags,
			visibility,
			postGif
		}: {
			content: string;
			feeling: string;
			files: File[];
			tags: string[];
			visibility: string;
			postGif: string[];
		},
		{ rejectWithValue }
	) => {
		try {
			const formData = new FormData();
			formData.append('content', content);
			formData.append('feeling', feeling);

			files.forEach((file) => formData.append('files', file));
			formData.append('tags', JSON.stringify(tags));
			formData.append('visibility', visibility);
			formData.append('gifs', JSON.stringify(postGif));

			const res = await API.post('/api/post/create-post', formData, {
				withCredentials: true
			});

			return res.data;
		} catch (error) {
			console.error('Failed to create post:', error);
			return rejectWithValue('Failed to create post. Please try again.');
		}
	}
);

// Async thunk to fetch posts
export const fetchPosts = createAsyncThunk<
	Post[],
	{ feeling?: 'lucky' | 'unlucky' | 'all' },
	{ rejectValue: string }
>('posts/fetchPosts', async ({ feeling }, { rejectWithValue }) => {
	try {
		const res = await API.get('/api/post/get-all-posts', {
			params: { feeling: feeling === 'all' ? undefined : feeling }
		});

		const sanitizedPosts = res.data.posts.map((post: Post) => ({
			...post,
			stats: {
				luck: post.stats?.luck ?? 0,
				comments: post.stats?.comments ?? 0,
				caps: post.stats?.caps ?? 0,
				saves: post.stats?.saves ?? 0,
				shares: post.stats?.shares ?? 0
			}
		}));

		return sanitizedPosts;
	} catch (error) {
		console.error('Fetch posts failed:', error);
		return rejectWithValue('Failed to fetch posts.');
	}
});

//like toggle functionality
export const toggleLuckPost = createAsyncThunk(
	'posts/toggleLuckPost',
	async (postId: string, { rejectWithValue }) => {
		try {
			const res = await API.post(
				`/api/post/toggle-luck-post/${postId}`,
				{},
				{ withCredentials: true }
			);
			return res.data;
		} catch (err) {
			console.error('Failed to toggle luck on post:', err);
			return rejectWithValue('Failed to toggle luck on post.');
		}
	}
);

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		setPosts: (_state, action: PayloadAction<Post[]>) => action.payload,
		removePost: (state, action: PayloadAction<string>) =>
			state.filter((post) => post._id !== action.payload)
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPosts.fulfilled, (_state, action: PayloadAction<Post[]>) => {
				return action.payload;
			})
			.addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
				state.unshift(action.payload);
			})
			.addCase(
				toggleLuckPost.fulfilled,
				(state, action: PayloadAction<{ postId: string; luck: number }>) => {
					const post = state.find((p) => p._id === action.payload.postId);
					if (post) {
						post.stats!.luck = action.payload.luck;
					}
				}
			);
	}
});

export const { setPosts, removePost } = postsSlice.actions;
export default postsSlice.reducer;
