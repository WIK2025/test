import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from "./NewsFeed.module.css";


const ARTICLE_DATA = [
    {
        id: 'future-of-js', 
        title: 'Статья 1', 
        description: 'Описание статьи 1',
        category: 'javascript',
        authorID: 'system',
        authorName: 'Редакция'
    }, {
        id: 'css-modules', 
        title: 'Статья 2', 
        description: 'Описание статьи 2',
        category: 'css',
        authorID: 'system',
        authorName: 'Редакция'
    }, {
        id: 'react-router-v6', 
        title: 'Статья 3', 
        description: 'Описание статьи 3',
        category: 'react',
        authorID: 'system',
        authorName: 'Редакция'
    }
];

function NewsFeed() {
    const { currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const savedArticles = localStorage.getItem('blog_articles');
        if (savedArticles) {
            setArticles(JSON.parse(savedArticles));
        } else {
            localStorage.setItem('blog_articles', JSON.stringify(ARTICLE_DATA));
            setArticles(ARTICLE_DATA);
        }
    }, []);

    const searchQuery = searchParams.get('search') || '';
    const categoryQuery = searchParams.get('category') || '';

    const handleSearchChange = (event) => {
        const text = event.target.value;
        const newParams = new URLSearchParams(searchParams);
        if (text) {
            newParams.set('search', text);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams);
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        const newParams = new URLSearchParams(searchParams);
        if (category) {
            newParams.set('category', category);
        } else {
            newParams.delete('category');
        }
        setSearchParams(newParams);
    }; 

    const filteredArticles = articles.filter((article) => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryQuery === '' || article.category === categoryQuery;
        return matchesSearch && matchesCategory;
    });

    const handleResetFilters = () => {
        setSearchParams({});
    };

    // удаление статьи 
    const handleDeleteClick = (articleId) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить эту статью?");
        
        if (isConfirmed) {
            //  актуальный массив, по ID
            const allArticles = JSON.parse(localStorage.getItem('blog_articles') || '[]');
            const updatedArticles = allArticles.filter(article => article.id !== articleId);
            
            // cохраняем в localStorage 
            localStorage.setItem('blog_articles', JSON.stringify(updatedArticles));
            setArticles(updatedArticles);
        }
    };

       return (
        <>
            <h1>Лента свежих новостей</h1>
            {currentUser && (
                <Link to='/dashboard/create-article' style={{ display: 'inline-block', marginBottom: '15px' }}>
                    + Создать статью
                </Link>
            )}

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', margin: '20px 0' }}>
                <div>
                    <label htmlFor="search-input">Поиск по тексту: </label>
                    <input
                        type='text'
                        id='search-input'
                        value={searchQuery}
                        onInput={handleSearchChange}
                    />
                </div>

                <div>
                    <label htmlFor='category-select'>Категории: </label>
                    <select 
                        id="category-select"
                        value={categoryQuery}
                        onChange={handleCategoryChange}
                    >
                        <option value=''> Все категории </option>
                        <option value='react'> React </option>
                        <option value='css'> CSS </option>
                        <option value='javascript'> JavaScript </option>
                    </select>

                    {(searchQuery || categoryQuery) && (
                        <button onClick={handleResetFilters} style={{ marginLeft: '10px' }}>
                            Сбросить фильтры
                        </button>
                    )}
                </div>
            </div>

           
            <div className={styles.articlesGrid}>
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => {
                        // проверка автора с учетом регистра 
                        const isAuthor = currentUser && (currentUser.id === article.authorID || currentUser.id === article.authorId);

                        return (
                            <article key={article.id} className={styles.articleCard}>
                                <div>
                                    {article.category && (
                                        <span className={styles.categoryBadge}>
                                            {article.category.toUpperCase()}
                                        </span>
                                    )}
                                    <span className={styles.authorName}>Автор: {article.authorName}</span>
                                    <h2 className={styles.articleTitle}>{article.title}</h2>
                                    <p className={styles.articleDesc}>{article.description}</p>
                                </div>
                                
                                <div className={styles.actionsBlock}>
                                    <Link to={`/news/${article.id}`} className={styles.readLink}>
                                        Читать полностью
                                    </Link>
                                    
                                    {isAuthor && (
                                        <>
                                            <Link to={`/dashboard/edit-article/${article.id}`} className={styles.editLink}>
                                                Редактировать
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteClick(article.id)} 
                                                className={styles.deleteBtn}
                                                title="Удалить статью"
                                            >
                                                Удалить статью
                                            </button>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <p>По вашему запросу ничего не найдено</p>
                )}
            </div>
        </>
    );
}

export default NewsFeed;



// import { Link, useSearchParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// // https:localhost/news?search=react&category=frontend
// import { useAuth } from '../context/AuthContext';

// const ARTICLE_DATA = [
//     {
//         id: 'future-of-js', 
//         title: 'Статья 1', 
//         description: 'Описание статьи 1',
//         category: 'javascript',
//         authorID: 'system',
//         authorName: 'Редакция'
//     }, {
//         id: 'css-modules', 
//         title: 'Статья 2', 
//         description: 'Описание статьи 2',
//         category: 'css',
//         authorID: 'system',
//         authorName: 'Редакция'
//     }, {
//         id: 'react-router-v6', 
//         title: 'Статья 3', 
//         description: 'Описание статьи 3',
//         category: 'react',
//         authorID: 'system',
//         authorName: 'Редакция'
//     }
// ];

// function NewsFeed() {
//     const { currentUser } = useAuth(); // узнаем авторизован ли пользователь, получаем текущего пользователя
//     const [articles, setArticles] = useState([]);
    
//     useEffect(() => {
//         const savedArticles = localStorage.getItem('blog_articles');
//         if (savedArticles) {
//             setArticles(JSON.parse(savedArticles));
//         } else {
//             localStorage.setItem('blog_articles', JSON.stringify(ARTICLE_DATA));
//             setArticles(ARTICLE_DATA);
//         }
//     }, []);
    
//     const searchQuery = searchParams.get('search') || '';
//     // достаем текущее значение фильтров
//     const categoryQuery = searchParams.get('category') || '';

//     const handleSearchChange = (event) => {
//         const text = event.target.value;
//         const newParams = new URLSearchParams(searchParams);
    
//         if (text) {
//         newParams.set('search', text); // устанавливаем текст в 
//          } else {
//         newParams.delete('search'); // если поле очистили
//         }
//         setSearchParams(newParams); // обновляем URL адрес

//     };

//     const handleCategoryChange = (event) => {
//         const category = event.target.value;
//         const newParams = new URLSearchParams(searchParams);
//         if (category) {
//             newParams.set('category', category);
//         } else {
//             newParams.delete('category');
//         }
//         setSearchParams(newParams);
//     }; 

//      // фильтрация на основе полученных значений
//     const filteredArticles = articles.filter((article) => {
// // в нижнем регистре, в описании или названии 
//         const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    
//         article.description.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesCategory = categoryQuery === '' || article.category === categoryQuery;
//         return matchesSearch && matchesCategory;
//     });

//     const handleResetFilters = () => {
//         setSearchParams({}); // передаем пустой обьект, URl становится / news
//     };



//     return (
//         <>
//             <h1>Лента свежих новостей</h1>
//             {/* кнопка добавления, если пользователь авторизован */}
//             {currentUser && (
//                 <link to='/dashboard/create-article' >
//                     + Создать статьтью
//                 </link>
//             )}

//             {/*БЛОК ФИЛЬТРОВ и ПОИСКА*/}
//             <div style={{ 
//                 display: 'flex', 
//                 gap: '15px',
//                 alignItems: 'center', 
//                 margin: '20px 0' }}>
//                 {/*ПОЛЕ ПОИСКА Текстовое*/}
//                 <div>
//                     <label htmlFor="search-input">Поиск по тексту: </label>
//                     <input
//                         type='text'
//                         id='search-input'
//                         value={searchQuery}
//                         onInput={handleSearchChange}
//                     />
//                 </div>
//                  {/*Выпадающий список категорий*/}

//                  <div>
//                     <label htmlFor='category-select'>Категории: </label>
//                     <select 
//                         id="category-select"
//                         value={categoryQuery}
//                         onChange={handleCategoryChange}
//                     >
//                         <option value=''> Все категории </option>
//                         <option value='react'> React </option>
//                         <option value='css'> CSS </option>
//                         <option value='javascript'> JavaScript </option>
//                     </select>

//                      {/*Кнопка сбросов параметров*/}
//                      {(searchQuery || categoryQuery) && (
//                         <button onClick={handleResetFilters} style={{ marginLeft: '10px' }}>
//                             Сбросить фильтры
//                         </button>
//                     )}
//                 </div>
//             </div>

//             <div>
//                 {filteredArticles.length > 0 ? (
//                     filteredArticles.map((article) => (
//                         <article key={article.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
//                             <span>Автор: {article.authorName}</span>
//                             <h2>{article.title}</h2>
//                             <p>{article.description}</p>
//                             {article.category && <span style={{ marginRight: '10px' }}><b>{article.category.toUpperCase()}</b></span>}
//                             <Link to={`/news/${article.id}`} style={{ marginRight: '10px' }}>
//                                 Читать полностью
//                             </Link>
//                             {currentUser && currentUser.id === article.authorID && (
//                                 <Link to={`/dashboard/edit-article/${article.id}`}>
//                                     Редактировать
//                                 </Link>
//                             )}
//                         </article>
//                     ))
//                 ) : (
//                     <p>По вашему запросу ничего не найдено</p>
//                 )}
//             </div>
//         </>
//     );
// }

// export default NewsFeed;
{/* {ARTICLE_DATA.map((article) => (
                    <article key={article.id}>
                        <h2>{article.title}</h2>
                        <h2>{article.description}</h2>
                        <Link to={`/news/${article.id}`}>
                            Читать полностью
                        </Link>
                    </article>
                ))} */}