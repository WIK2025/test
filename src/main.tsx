import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/Layout/ErrorBoundary'; // Исправили на ErrorBoundary
import './styles/index.css';

// Добавляем приведение типов 'as HTMLElement', так как теперь это полноценный TypeScript-файл (.tsx)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Оборачиваем всё приложение в предохранитель для безопасности */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
