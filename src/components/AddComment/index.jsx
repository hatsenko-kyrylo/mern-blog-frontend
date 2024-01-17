import React, { useEffect, useState } from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from '../../axios';

export const Index = () => {
    const isAuth = useSelector(selectIsAuth);
    const { id } = useParams();

    const [isLoading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const avatar = useState(window.localStorage.getItem('avatarUrl'));

    const onSubmit = async () => {
        try {
            setLoading(true);

            await axios.patch(`/posts/${id}/comment`, {
                text,
            });
            setText('');
        } catch (error) {
            console.warn(error);
            alert('Comment creation error');
        }
    };

    return (
        <>
            {isAuth && (
                <div className={styles.root}>
                    <Avatar classes={{ root: styles.avatar }} src={avatar} />
                    <div className={styles.form}>
                        <TextField
                            label='Написать комментарий'
                            variant='outlined'
                            maxRows={10}
                            multiline
                            fullWidth
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button variant='contained' onClick={onSubmit}>
                            Отправить
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
