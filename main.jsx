import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import BlogLayout from './layouts/BlogLayout';
import About from './pages/About';
import ArticlePage from './pages/ArticlePage';
import Dashboard from './pages/Dashboard';
import NewsFeed from './pages/NewsFeed';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './layouts/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ArticleForm from './pages/ArticleForm';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <Routes>
        {/* Главный редирект с корня сайта на новости */}
        <Route path='/' element={<Navigate to="/news" replace />} />

        {/* Основной макет приложения */}
        <Route path='/' element={<BlogLayout />}>
          <Route path='news' element={<NewsFeed />} />
          <Route path='about' element={<About />} />
          <Route path='news/:articleId' element={<ArticlePage />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          
          {/* Защищенный приватный кабинет автора */}
          <Route 
            path='dashboard' 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path='profile' element={<Profile />} />
            <Route path='settings' element={<Settings />} />
            <Route path='create-article' element={<ArticleForm />} />
            <Route path='edit-article/:articleId' element={<ArticleForm />} />
          </Route>
        </Route>

        {/* Обработка несуществующих страниц */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  </AuthProvider>
);


// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import BlogLayout from './layouts/BlogLayout';
// import About from './pages/About';
// import ArticlePage from './pages/ArticlePage';
// import Dashboard from './pages/Dashboard';
// import NewsFeed from './pages/NewsFeed';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import NotFound from './pages/NotFound';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ProtectedRoute from './layouts/ProtectedRoute';
// import { AuthProvider } from './context/AuthContext';
// import ArticleForm from './pages/ArticleForm';

// createRoot(document.getElementById('root')).render(
//   <AuthProvider>
//     <Router>
//       <Routes>
//         {/* Автоматический редирект с корня сайта на страницу новостей */}
//         <Route path='/' element={<Navigate to="/news" replace />} />

//         {/* Основная обертка сайта с шапкой и подвалом */}
//         <Route path='/' element={<BlogLayout />}>
//           <Route path='news' element={<NewsFeed />} />
//           <Route path='about' element={<About />} />
//           <Route path='news/:articleId' element={<ArticlePage />} />
//           <Route path='login' element={<Login />} />
//           <Route path='register' element={<Register />} />
          
//           {/* Защищенная приватная зона автора */}
//           <Route 
//             path='dashboard' 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           >
//             <Route path='profile' element={<Profile />} />
//             <Route path='settings' element={<Settings />} />
//             <Route path='create-article' element={<ArticleForm />} />
//             <Route path='edit-article/:articleId' element={<ArticleForm />} />
//           </Route>
//         </Route>

//         {/* Обработка несуществующих адресов (404) */}
//         <Route path='*' element={<NotFound />} />
//       </Routes>
//     </Router>
//   </AuthProvider>
// );
