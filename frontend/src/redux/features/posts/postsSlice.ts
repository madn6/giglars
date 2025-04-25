import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Post Type
interface Post {
	image: string;
	name: string;
	username: string;
	time: string;
	postText: string;
	postImage?: string;
	stats: {
		luck: number;
		comments: number;
		caps: number;
		saves: number;
		shares: number;
	};
}

// Define the initial state with the correct type
const initialState: Post[] = [

];

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		addPost: (state, action: PayloadAction<Post>) => {
			state.unshift(action.payload);
		},
		removePost: (state, action: PayloadAction<number>) => {
			return state.filter((_, index) => index !== action.payload);
		},
		setPosts: (_state, action: PayloadAction<Post[]>) => {
			return action.payload;
		},
	}
});

export const { addPost, removePost,setPosts } = postsSlice.actions;
export default postsSlice.reducer;
