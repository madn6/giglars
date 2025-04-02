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
	{
		image: '/images/user.png',
		name: 'maddy69',
		username: '@mathanmuthukani',
		time: '2d',
		postText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
		postImage:
			'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg',
		stats: { luck: 32400, comments: 2400, caps: 566, saves: 566, shares: 34000 }
	},
	{
		image: '/images/user.png',
		name: 'ramya',
		username: '@ramya6868',
		time: '1h',
		postText: 'Reiciendis ea commodi maiores.',
		postImage:
			'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?cs=srgb&dl=pexels-fauxels-3183197.jpg&fm=jpg',
		stats: { luck: 10400, comments: 1300, caps: 232, saves: 400, shares: 12000 }
	}
];

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		// Fix: Explicitly define type for action payload
		addPost: (state, action: PayloadAction<Post>) => {
			state.unshift(action.payload);
		},
		removePost: (state, action: PayloadAction<number>) => {
			return state.filter((_, index) => index !== action.payload);
		}
	}
});

export const { addPost, removePost } = postsSlice.actions;
export default postsSlice.reducer;
