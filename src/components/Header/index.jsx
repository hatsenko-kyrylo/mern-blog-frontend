import React from 'react';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';

import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuth, logout } from '../../redux/slices/auth';

export const Header = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    const onClickLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
            window.localStorage.removeItem('token');
        }
    };

    return (
        <div className={styles.root}>
            <Container maxWidth='lg'>
                <div className={styles.inner}>
                    <NavLink className={styles.logo} to='/'>
                        <div>ARCHAKOV BLOG</div>
                    </NavLink>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <NavLink to='/add-post'>
                                    <Button variant='contained'>
                                        Написать статью
                                    </Button>
                                </NavLink>
                                <Button
                                    onClick={onClickLogout}
                                    variant='contained'
                                    color='error'
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <NavLink to='/login'>
                                    <Button variant='outlined'>Войти</Button>
                                </NavLink>
                                <NavLink to='/register'>
                                    <Button variant='contained'>
                                        Создать аккаунт
                                    </Button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
