import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    comments: [],
    isLoading: false,
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
});

const {} = commentsSlice.actions;

export default commentsSlice.reducer;
