import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const location = useLocation(); 
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;

// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function ProtectedRoute({ children }) {

//     const location = useLocation(); // записываем откуда пришел пользователь
//     const { currentUser } = useAuth();
//     console.log(currentUser);
//     // если не авторизован
//      if (!currentUser) {
//     // state сохраняет текущий адрес, чтобы после логинавренть назад юзера
//         return <Navigate to='/login' state={{ from: location }} replace />; // state - сохраняет текущий адрес, чтобы полсе логина вернуть юзера назад

//     }

//     // если авторизован то возвращаем дочерний компонент dashboard
//     return children;
    
// }

// export default ProtectedRoute;