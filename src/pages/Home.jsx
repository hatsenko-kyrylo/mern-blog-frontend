import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags, fetchComments } from '../redux/slices/posts';

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { posts, tags, comments } = useSelector((state) => state.posts);

    const isPostsLooading = posts.status === 'loading';
    const isTagsLooading = tags.status === 'loading';
    const isCommentsLoading = comments.status === 'loading';

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
        dispatch(fetchComments());
    }, []);

    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={0}
                aria-label='basic tabs example'
            >
                <Tab label='Новые' />
                <Tab label='Популярные' />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLooading ? [...Array(5)] : posts.items).map(
                        (obj, i) =>
                            isPostsLooading ? (
                                <Post key={i} isLoading={true} />
                            ) : (
                                <Post
                                    id={obj._id}
                                    title={obj.title}
                                    imageUrl={
                                        obj.imageUrl
                                            ? `http://localhost:4444/${obj.imageUrl}`
                                            : ''
                                    }
                                    user={obj.user}
                                    createdAt={obj.createdAt}
                                    viewsCount={obj.viewsCount}
                                    commentsCount={obj.comments.length}
                                    tags={obj.tags}
                                    isEditable={userData?._id === obj.user._id}
                                />
                            )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLooading} />
                    <CommentsBlock
                        items={comments.items}
                        isLoading={isCommentsLoading}
                    />
                </Grid>
            </Grid>
        </>
    );
};
