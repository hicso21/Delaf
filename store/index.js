import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './productsSlice';
import userSlice from './userSlice';

export const store = configureStore({
	reducer: {
		products: productsSlice.reducer,
		user: userSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
