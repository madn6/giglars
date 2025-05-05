import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../utils/axios';

// Define the Post Type
export interface Post {
	_id?: string;
	profileImage?: string;
	userName?: string;
	email?: string;
	time?: string;

	content?: string;
	images: string[];
	feeling: string;
	tags: string[];
	gifs: string[];
	visibility: string;
	createdAt?: string;
	updatedAt?: string;

	stats?: {
		luck: number;
		comments: number;
		caps: number;
		saves: number;
		shares: number;
	};

	userId: {
		profileImage: string;
		uniqueUsername: string;
		displayName: string;
	};
}

export interface CreatePostPayload {
	content: string;
	feeling: string;
	files: File[];
	tags: string[];
	visibility: string;
	postGif: string[];
}

// Define the initial state with the correct type
const initialState: Post[] = []; // This is the initial state (an empty array of posts)

// Async thunk to create a post
export const createPost = createAsyncThunk(
	'posts/createPost', // The action type
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

			return res.data; // Return the response data for success
		} catch (error) {
			console.error('Failed to create post:', error);
			return rejectWithValue('Failed to create post. Please try again.'); // Handle failure
		}
	}
);

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		// Action to set posts from the backend
		setPosts: (_state, action: PayloadAction<Post[]>) => {
			return action.payload;
		},
		// Action to remove a post by id
		removePost: (state, action: PayloadAction<string>) => {
			return state.filter((post) => post._id !== action.payload);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
			// Adds a new post to the start of the posts array
			state.unshift(action.payload);
		});
	}
});

export const { setPosts, removePost } = postsSlice.actions;
export default postsSlice.reducer;
