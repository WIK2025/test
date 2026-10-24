import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/posts/';

function App() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  // получение постов 
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить сообщения. Проверьте бэкенд!');
    }
  };

  // обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // валидация перед отправкой
    if (!text.trim()) {
      setError('Сообщение не может быть пустым!');
      return;
    }

    const payload = {
      text: text,
      // если имя не заполнено, отправляем Аноним 
      author: author.trim() ? author : 'Аноним'
    };

    try {
      const response = await axios.post(API_URL, payload);
      // добавляем новый пост в начало 
      setPosts([response.data, ...posts]);
      // очищаем форму
      setText('');
      setAuthor('');
      setError('');
    } catch (err) {
      setError(' Проверьте соединение с сервером.');
    }
  };

  // обработка удаления сообщения 
  const handleDelete = async (id) => {
    try {
      // отправляем асинхронный запрос на удаление 
      await axios.delete(`${API_URL}${id}/`);
      // убираем пост
      setPosts(posts.filter(post => post.id !== id));
      setError('');
    } catch (err) {
      setError('Не удалось удалить сообщение. Проверьте соединения с сервером.');
    }
  };

  return (
    <div className="container">
      <h1>Клик-стена 💬</h1>

      {/* вывод ошибок */}
      {error && <div className="error-banner">{error}</div>}

      {/* форма публикации */}
      <form onSubmit={handleSubmit} className="post-form">
        <input 
          type="text" 
          placeholder="Ваше имя (необязательно)" 
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea 
          placeholder="Что у вас на уме? (макс. 280 символов)" 
          maxLength={280}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <button type="submit">Опубликовать</button>
      </form>

      {/* лента сообщений */}
      <div className="feed">
        {posts.length === 0 ? (
          <p className="no-posts">Создайте ваше сообщение!!!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-author">🙂 {post.author}</span>
                <div className="post-actions">
                  <span className="post-time">
                    {new Date(post.created_at).toLocaleString('ru-RU')}
                  </span>
                  {/* инлайн кнопка удаления поста */}
                  <button 
                    onClick={() => handleDelete(post.id)} 
                    className="delete-btn" 
                    title="Удалить это сообщение"
                  >
                    ❌
                  </button>
                </div>
              </div>
              <p className="post-text">{post.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
