import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postsSlice';
import userReducer from '../features/users/userSlice';
import todayEntryReducer from '../features/todayEntry/todayEntrySlice';
import moodEntryReducer from '../features/moodEntry/moodEntrySlice';
import fetchQuoteReducer from '../features/quote/QuoteSlice'

const store = configureStore({
	reducer: {
		auth: authReducer,
		posts: postReducer,
		users: userReducer,
		todayEntry: todayEntryReducer,
		moodEntry: moodEntryReducer,
		quote:fetchQuoteReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false
		})
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
