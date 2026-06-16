
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function ArticleForm() {
    const { currentUser } = useAuth();
    const { articleId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('javascript');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const isEditMode = Boolean(articleId);

    useEffect(() => {
        if (isEditMode) {
            const savedArticles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
            const articleEdit = savedArticles.find(a => a.id === articleId);
            if (!articleEdit) {
                setError('Статья не найдена');
                return;
            }  
            if (articleEdit.authorId !== currentUser?.id) {
                alert('ВЫ МОЖЕТЕ РЕДАКТИРОВАТЬ ТОЛЬКО СВОЮ СТАТЬЮ');
                navigate('/news');
                return;
            }
            
            setTitle(articleEdit.title);
            setCategory(articleEdit.category || 'javascript');
            setDescription(articleEdit.description);
        }
    }, [articleId, currentUser, isEditMode, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || !description.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        const articles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
        
        if (isEditMode) {
            const updateArticle = articles.map(a => {
                if (a.id === articleId) {
                    return {
                        ...a,
                        title,
                        category,
                        description
                    };
                }
                return a;
            });
            localStorage.setItem('blog_articles', JSON.stringify(updateArticle));
        } else {
            const newArticle = {
                id: Date.now().toString(),
                title,
                category, 
                description,
                authorId: currentUser.id,
                authorName: currentUser.username
            };
            articles.unshift(newArticle);
            localStorage.setItem('blog_articles', JSON.stringify(articles));
        }
        navigate('/news');
    };

    return (
        <div>
            <h2>{isEditMode ? "Редактировать статью" : "Создать статью"}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите заголовок" 
                />
                <input 
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Введите категорию" 
                />
                <textarea 
                    rows='10'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите текст статьи" 
                />
                <button type="submit">Сохранить</button>
                {isEditMode && (
    <button 
        type="button" 
        onClick={() => {
            if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
                const articles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
                const updated = articles.filter(a => a.id !== articleId);
                localStorage.setItem('blog_articles', JSON.stringify(updated));
                navigate('/news');
            }
        }} 
        style={{ color: 'red', marginRight: '10px' }}
    >
         Удалить статью
    </button>
)}

                <button type="button" onClick={() => navigate(-1)}>Отмена</button>
            </form>
        </div>
    );
}

export default ArticleForm;

// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';

// function ArticleForm() {
//     const { currentUser } = useAuth();
//     const { articleId } = useParams();
//     const navigate = useNavigate();

//     const [title, setTitle] = useState('');
//     const [category, setCategory] = useState('javascript');
//     const [description, setDescription] = useState('');
//     const [error, setError] = useState('');
//     const isEditMode = Boolean(articleId);

//     useEffect(() => {
//         if (isEditMode) {
//             const savedArticles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
//             const articleEdit = savedArticles.find(a => a.id === articleId);
//             if (!articleEdit) {
//                 setError('Статья не найдена');
//                 return;
//             } 
//             // Жесткая Проверка: именно автор пытаетсяредактировать
//             if (articleEdit.authorId !== currentUser?.id) {
//                 alert('ВЫ МОЖЕТЕ РЕДАКТИРОВАТЬ ТОЛЬКО СВОЮ СТАТЬЮ');
//                 navigate('/news');
//                 return;
//             }
            
//             setTitle(articleEdit.title);
//             setCategory(articleEdit.category || 'javascript');
//             setDescription(articleEdit.description);
//         }
//     }, [articleId, currentUser, isEditMode, navigate]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');
//         if (!title.trim() || !description.trim()) {
//             setError('Пожалуйста, заполните все поля');
//             return;
//         }
//     const articles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
        
//         if (isEditMode) {
//             const updateArticle = articles.map(a => {
//                 if (a.id === articleId) {
//                     return {
//                         ...a, // берем все что есть у  статьи
//                          title,
//                         category,
//                         description
//                     };
//                 }
//                 return a;
//             });

//             localStorage.setItem('blog_articles', JSON.stringify(updateArticle));
//         } else {
//             const newArticle = {
//                 id: Date.now().toString(),
//                 title,
//                 category, 
//                 description,
//                 authorId: currentUser.id,
//                 authorName: currentUser.username
//             };
//             articles.unshift(newArticle);
//             localStorage.setItem('blog_articles', JSON.stringify(articles));
//         }
//         navigate('/news');
//     };

//     return (
//         <div>
//             <h2>{isEditMode ? "Редактировать статью" : "Создать статью"}</h2>
//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Введите заголовок" 
//                 />
//                 <input 
//                     type="text"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     placeholder="Введите категорию" 
//                 />
//                 <textarea 
//                     rows='10'
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Введите текст статьи" 
//                 />
//                 <button type="submit">Сохранить</button>
//                 <button type="button" onClick={() => navigate(-1)}>Отмена</button>
//             </form>
//         </div>
//     );
// }

// export default ArticleForm;