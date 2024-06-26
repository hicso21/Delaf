// @ts-nocheck
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchApi from '../utils/constants/fetchApi';

const initialState = {
	products: [],
	status: 'loading',
	error: null,
};

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getProducts.pending, (state, action) => {
				state.status = 'loading';
			})
			.addCase(getProducts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.products = action.payload;
			})
			.addCase(getProducts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export const getProducts = createAsyncThunk('getProducts', async () => {
	const { data } = fetchApi.get('/stripe/prices');
	return data;
});

export default productsSlice;
