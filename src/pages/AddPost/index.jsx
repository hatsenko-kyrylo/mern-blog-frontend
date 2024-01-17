import React, {
    useState,
    useCallback,
    useMemo,
    useRef,
    useEffect,
} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();
    const [title, setTitle] = useState();
    const [tags, setTags] = useState();
    const inputFileRef = useRef(null);
    const { id } = useParams();

    const [isLoading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');

    const isEditing = Boolean(id);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);

            //Отправляем на сервер и в ответе получаем ссылку на изображение
            const { data } = await axios.post('/upload', formData);
            setImageUrl(data.url);
        } catch (error) {
            console.warn(error);
            alert('Error loading file');
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    // Из за особенности этой библиотеки нужно еще оборачивать в useCallback
    const onChange = useCallback((value) => {
        setText(value);
    }, []);

    // Редактирование статьи
    useEffect(() => {
        if (id) {
            axios
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setImageUrl(data.imageUrl);
                    setText(data.text);
                    setTags(data.tags.join(','));
                })
                .catch((err) => {
                    console.warn(err);
                    alert('Error receiving article');
                });
        }
    }, []);

    // Настройки этого компонента (Также нужно useMemo)
    const options = useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    );

    if (!window.localStorage.getItem('token') && !isAuth) {
        navigate('/');
    }

    const onSubmit = async () => {
        try {
            setLoading(true);

            const fields = {
                title,
                tags,
                imageUrl,
                text,
            };

            // Разные запросы в зависимости от того что мы делаем, публикуем или изменяем
            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields);
            const articleId = isEditing ? id : data._id;

            navigate(`/posts/${articleId}`);
        } catch (error) {
            console.warn(error);
            alert('Article creation error');
        }
    };

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                variant='outlined'
                size='large'
                onClick={() => inputFileRef.current.click()}
            >
                Загрузить превью
            </Button>
            <input
                type='file'
                onChange={handleChangeFile}
                hidden
                ref={inputFileRef}
            />
            {imageUrl && (
                <>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={onClickRemoveImage}
                    >
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`http://localhost:4444/${imageUrl}`}
                        alt='Uploaded'
                    />
                </>
            )}
            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                variant='standard'
                placeholder='Заголовок статьи...'
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                classes={{ root: styles.tags }}
                variant='standard'
                placeholder='Тэги'
                fullWidth
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <SimpleMDE
                className={styles.editor}
                value={text}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size='large' variant='contained'>
                    {isEditing ? 'Save' : 'Publish'}
                </Button>
                <a href='/'>
                    <Button size='large'>Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
