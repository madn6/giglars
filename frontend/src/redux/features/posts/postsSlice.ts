import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../utils/axios';
import { Post, CreatePostPayload } from './postTypes';
import {
	createComment,
	deleteComment,
	getComments,
	toggleLuckPost,
	updateComment
} from '../postInteractions/interactionThunks';

interface PostsState {
	postItems: Post[];
	loading: boolean;
	error: string | null;
	hasLikedByPost: Record<string, boolean>;
}

const initialState: PostsState = {
	postItems: [],
	loading: false,
	error: null,
	hasLikedByPost: {}
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
	{ feeling?: 'lucky' | 'unlucky' | 'all'; userId: string },
	{ rejectValue: string }
>('posts/fetchPosts', async ({ feeling, userId }, { rejectWithValue }) => {
	try {
		const res = await API.get('/api/post/get-all-posts', {
			params: { feeling: feeling === 'all' ? undefined : feeling }
		});

		const sanitized = res.data.posts.map((post: Post) => {
			const userHasLiked = post.luckBy.includes(userId);
			return {
				...post,
				stats: {
					luck: post.stats?.luck ?? 0,
					comments: post.stats?.comments ?? 0,
					caps: post.stats?.caps ?? 0,
					saves: post.stats?.saves ?? 0,
					shares: post.stats?.shares ?? 0,
					userHasLiked
				}
			};
		});

		//fetchPosts.fulfilled: Initializes the correct userHasLiked state when the app loads or posts are refreshed.
		//toggleLuckPost.fulfilled: Keeps the like state in sync after user interaction.

		return sanitized;
	} catch (error) {
		console.error('Failed to fetch posts:', error);
		return rejectWithValue('Failed to fetch posts.');
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
				action.payload.forEach((post) => {
					if (post._id) {
						state.hasLikedByPost[post._id] = post.stats?.userHasLiked ?? false;
					}
				});
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Unknown error';
			})
			.addCase(createPost.fulfilled, (state, action) => {
				state.postItems.unshift(action.payload);
			})
			.addCase(toggleLuckPost.fulfilled, (state, action) => {
				const { postId, updatedLuckCount, userHasLiked } = action.payload;
				const post = state.postItems.find((p) => p._id === postId);
				if (post && post.stats) {
					post.stats.luck = updatedLuckCount;
					post.stats.userHasLiked = userHasLiked;
				}
				state.hasLikedByPost[postId] = userHasLiked;
			})

			// Create Comment
			.addCase(createComment.fulfilled, (state, action) => {
				const post = state.postItems.find((p) => p._id === action.payload.postId);
				if (post) {
					post.comments = [...(post.comments || []), action.payload.comment];
					post.stats.comments += 1;
				}
			})

			.addCase(getComments.fulfilled, (state, action) => {
				const post = state.postItems.find((p) => p._id === action.payload.postId);
				if (post) {
					post.comments = action.payload.comments;
				}
			})

			// Update Comment
			.addCase(updateComment.fulfilled, (state, action) => {
				const post = state.postItems.find((p) => p._id === action.payload.postId);
				if (post?.comments) {
					const idx = post.comments.findIndex((c) => c._id === action.payload.comment._id);
					if (idx !== -1) {
						post.comments[idx] = action.payload.comment;
					}
				}
			})

			// Delete Comment
			.addCase(deleteComment.fulfilled, (state, action) => {
				const post = state.postItems.find((p) => p._id === action.payload.postId);
				if (post?.comments) {
					post.comments = post.comments.filter((c) => c._id !== action.payload.commentId);
					post.stats.comments = Math.max(0, post.stats.comments - 1);
				}
			});
	}
});

export const { setPosts, removePost } = postsSlice.actions;
export default postsSlice.reducer;
