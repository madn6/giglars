import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postsSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';

const persistConfig = {
	key: 'auth',
	storage
};

const persistAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
	reducer: {
		auth: persistAuthReducer,
		posts: postReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false 
		})
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
