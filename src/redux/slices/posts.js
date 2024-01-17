import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});
export const fetchRemovePost = createAsyncThunk(
    'posts/fetchRemovePost',
    async (id) => axios.delete(`/posts/${id}`)
);

export const fetchComments = createAsyncThunk(
    'posts/fetchComments',
    async () => {
        const { data } = await axios.get('/comments');
        return data;
    }
);
export const fetchAddComment = createAsyncThunk(
    'posts/fetchAddComment',
    async (id) => axios.patch(`/posts/${id}/comment`)
);

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
    comments: {
        items: [],
        status: 'loading',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get posts
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = 'error';
            });
        // Get tags
        builder
            .addCase(fetchTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = 'error';
            });
        // Delete post
        builder.addCase(fetchRemovePost.pending, (state, action) => {
            state.posts.items = state.posts.items.filter(
                (obj) => obj._id !== action.meta.arg
            );
        });
        // Get comments
        builder
            .addCase(fetchComments.pending, (state) => {
                state.comments.items = [];
                state.comments.status = 'loading';
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments.items = action.payload;
                state.comments.status = 'loaded';
            })
            .addCase(fetchComments.rejected, (state) => {
                state.comments.items = [];
                state.comments.status = 'error';
            });
    },
});

const { reducer, actions } = postsSlice;

export default reducer;
