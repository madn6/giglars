import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Define the initial state with the correct type

const initialState: Post[] = []; // This is the initial state (an empty array of posts)

const postsSlice = createSlice({
	name: 'posts', // This is the name of the slice and it helps generate action types like 'posts/setPosts'
	initialState, // This links to the initial state, which is an empty array here
	reducers: {
		setPosts: (_state, action: PayloadAction<Post[]>) => {
			return action.payload; // When setPosts is dispatched, the posts state is replaced by the new data
		},
		addPost: (state, action: PayloadAction<Post>) => {
			state.unshift(action.payload); // Adds a new post to the start of the posts array
		},
		removePost: (state, action: PayloadAction<string>) => {
			return state.filter((post) => post._id !== action.payload);
		}
	}
});

export const { setPosts, addPost, removePost } = postsSlice.actions;
export default postsSlice.reducer;
