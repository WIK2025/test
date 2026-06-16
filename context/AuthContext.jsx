import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('active_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const register = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(u => u.username === username);
        if (userExists) {
            return { success: false, message: 'Пользователь с таким именем уже существует' };
        }
        const newUser = { id: Date.now().toString(), username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return { success: false, message: 'Пользователь с таким именем уже существует' };
    }
    const newUser = { id: Date.now().toString(), username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    
    setCurrentUser(newUser); // Устанавливаем пользователя активным 
    localStorage.setItem('active_user', JSON.stringify(newUser)); // Сохраняем сессию
   

    return { success: true, message: 'Регистрация успешна! Вход выполнен.' };
};

        return { success: true, message: 'Регистрация успешна' };
    };

    const login = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userActive = users.find(u => u.username === username && u.password === password);
        
        if (userActive) {
            setCurrentUser(userActive);
            localStorage.setItem('active_user', JSON.stringify(userActive));
            return { success: true };
        } else {
            return { success: false, message: 'Неверное имя или пароль' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('active_user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;



// import { createContext, useContext, useState } from 'react';


// // контекст это коробка  в которой будут лежать данные об авторизации
// const AuthContext = createContext(null);



// export function AuthProvider({ children }) {

//     // для хранения текущего вошедшего пользователя
//    const [currentUser, setCurrentUser] = useState(() => {
//         const savedUser = localStorage.getItem('active_user');
//         return savedUser ? JSON.parse(savedUser) : null;
//     });

//    const register = (username, password) => {
//         const users = JSON.parse(localStorage.getItem('users') || '[]');
//         const userExists = users.some(u => u.username === username);
//         if (userExists) {
//             return { success: false, message: 'Пользователь с таким именем уже существует' };
//         }
//         const newUser = { id: Date.now().toString(), username, password };
//         users.push(newUser);
//         localStorage.setItem('users', JSON.stringify(users));
//         return { success: true, message: 'Регистрация успешна' };
//     };

//     const login = (username, password) => {
//         const users = JSON.parse(localStorage.getItem('users') || '[]');
//         const userActive = users.find(u => u.username === username && u.password === password);
        
//         if (userActive) {
//             setCurrentUser(userActive);
//             localStorage.setItem('active_user', JSON.stringify(userActive));
//             return { success: true };
//         } else {
//             return { success: false, message: 'Неверное имя или пароль' };
//         }
//     };
//      const logout = () => {
//         setCurrentUser(null);
//         localStorage.removeItem('active_user');
//     };

//   // добавить проброс
//   // транслятор данных обьекты currentUser, login, register, logout
//   return (
//         <AuthContext.Provider value={{ currentUser, login, register, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
  



// // создаем собственный хук для удобного использования контекста в др. компонентах
// export function useAuth() {
//     return useContext(AuthContext);
// }

// export default useAuth;