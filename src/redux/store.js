import { configureStore } from '@reduxjs/toolkit';
import posts from './slices/posts.js';
import auth from './slices/auth.js';

const store = configureStore({
    reducer: { posts, auth },
});

export default store;
