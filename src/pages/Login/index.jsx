import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);

    // React Hook Form хранит state внутри себя, поэтому мы можем его не писать
    // mode: 'onChange' - обозначает что валидация происходит только в том случае, когда поля ввода меняются
    // helperText={errors.email?.message} - Если ошибки нет, то не вытаскивает сообщение, если есть ошибка,
    // то вытаскивет из {...register('email', { required: 'Enter email' })}
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: 'test@gmail.com',
            password: 'Test123!',
        },
        mode: 'onBlur',
    });

    // Будет выполняться только если React Hook Form понял что валидация прошла корректно
    // Помещаем в handleSubmit
    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));

        if (!data.payload) {
            alert('Failed to Log in');
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
            window.localStorage.setItem('avatarUrl', data.payload.avatarUrl);
        }
    };

    if (isAuth) {
        navigate('/');
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant='h5'>
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label='E-Mail'
                    type='email'
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    fullWidth
                    {...register('email', { required: 'Enter email' })}
                />
                <TextField
                    className={styles.field}
                    label='Пароль'
                    fullWidth
                    type='password'
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', { required: 'Enter password' })}
                />
                <Button
                    type='submit'
                    size='large'
                    variant='contained'
                    fullWidth
                    disabled={!isValid}
                >
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
