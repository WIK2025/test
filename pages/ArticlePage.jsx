import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function ArticlePage() {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const savedArticles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
        const foundArticle = savedArticles.find(a => a.id === articleId);
        setArticle(foundArticle);
    }, [articleId]);

    const handleGoBack = () => navigate(-1);
    const handleGoHome = () => navigate('/news');

    if (!article) {
        return (
            <>
                <h2>Статья не найдена</h2>
                <button onClick={handleGoHome}>На главную ленту</button>
            </>
        );
    }

    return (
        <>
            <button onClick={handleGoBack}>⬅ Назад в ленту</button>
            <div>
                <h1>{article.title}</h1>
                <span>Категория: {article.category || 'Не указана'}</span>
                <br />
                <span>Автор: {article.authorName}</span>
                <hr />
                <p>{article.description}</p>
            </div>
            <button onClick={handleGoHome}>⏹ На главную ленту</button>
        </>
    );
}

export default ArticlePage;

// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// function ArticlePage() {
//     // В main.jsx взят из Route "news/:articleId"
//     const { articleId } = useParams();
//     // navigate возвращает функцию, которой можно программно менять URL
//     const navigate = useNavigate();
//     // Возвращает на 1 страницу назад (аналог кнопки "Назад")
//     const [article, setArticle] = useState(null);

//     useEffect(() => {
//         const savedArticles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
//         const foundArticle = savedArticles.find(a => a.id === articleId);
//         setArticle(foundArticle);
//     }, [articleId]);

//     const handleGoBack = () => navigate(-1);

//     // Возвращает к новостям
//     const handleGoHome = () => navigate('/news');

//     if (!article) {
//         return (
//             <>
//                 <h2>Статья не найдена</h2>
//                 <button onClick={handleGoHome}>На главную ленту</button>
//             </>
//         );
//     }

//     return (
//         <>
//             <button onClick={handleGoBack}>⬅ Назад в ленту</button>
//             <div>
//                 <h1>{article.title}</h1>
//                 <span>Категория: {article.category || 'Не указана'}</span>
//                 <br />
//                 <span>Автор: {article.authorName}</span>
//                 <hr />
//                 <p>{article.description}</p>
//             </div>
//             <button onClick={handleGoHome}>⏹ На главную ленту</button>
//         </>
//     );
// }

// export default ArticlePage;