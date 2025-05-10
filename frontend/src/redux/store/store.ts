import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postsSlice';
import userReducer from '../features/users/userSlice';
import newEntryReducer from '../features/todayEntry/todayEntrySlice'

const store = configureStore({
	reducer: {
		auth: authReducer,
		posts: postReducer,
		users: userReducer,
		todayEntry:newEntryReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false
		})
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
