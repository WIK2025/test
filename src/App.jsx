import { useState } from 'react'
import './App.css'

function App() {
  const name = 'Александр Серов';
  const role = 'Frontend Разработчик';
  const description = 'Занимаюсь Изучением React и JS.';

  return (
    <div className="card-container">
      <h1 style={{ 
        color: '#2c3e50', 
        marginBottom: '10px' 
      }}>{name}</h1>
      
      {/* Подзаголовок */}
      <h2 className="role-text">{role}</h2>
      
      {/* Параграф */}
      <p className="description">
        {description}
      </p>
      
      {/* Смайлик  */}
      <div className="emoji-section">
        <span>&#128585;</span>
        <blockquote>"Код — это все!!!"</blockquote>
      </div>
    </div>
  );
}

export default App
