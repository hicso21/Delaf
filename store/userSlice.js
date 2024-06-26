// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: {},
	error: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state = action.payload;
		},
	},
});

export const { setUserData } = userSlice.actions;

export default userSlice;
