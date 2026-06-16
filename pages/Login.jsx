import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const fromPage = location.state?.from?.pathname || '/news';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Все поля должны быть заполнены');
            return;
        }

        const result = login(username, password);

        if (result.success) {
            navigate(fromPage, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Войти в аккаунт</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Войти</button>
            </form>
            <p>Еще нет аккаунта? <Link to='/register'>Зарегистрироваться</Link></p>
        </div>
    );            
}

export default Login;


// import { useState } from "react";
// import{useNavigate, useLocation, Link} from "react-router-dom";
// import{useAuth} from '../context/AuthContext';

// function Login() {
//     // создаем хуки состояния
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const{login}=useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();

//     // откуда пришел пользователь: если шел в кабинет после авторизации, то вернем в кабинет, а емли зашел на логин сам, то перенаправим на ньюс,
//     // т.е. перепроверяем откудапришел.
//     const fromPage = location.state?.from?.pathname || '/news'; // ? - указывает на существование
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError(''); // сброс старых ошибок
//         if(!username.trim() || !password.trim()) {
//             setError('Все поля должны быть заполнены');
//             return;
//         }

        
//         const result = login(username, password);

//         if (result.success){
//             // перенаправляем туда куда шел изначально
//             navigate(fromPage,{replace: true});
//         }else{
//             setError(result.message);
//         }
//     };
//     return (
//         <div style={{ maxWidth: '400px', margin: '50px auto'}}>
//             <h2>Войти в аккаунт</h2>
//             {error && <p style={{color: 'red'}}>{error}</p>}

//             <form onSubmit={handleSubmit}>
//              <input type="text" placeholder="username"
//              value={username}
//              onChange={(e) => setUsername(e.target.value)}/>
//             <input type="password" placeholder="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}/>
            
//             <button type="submit">Войти</button>
//             </form>
//             <p>Еще нет аккаунта? <Link to= '/register'>Зарегистрироваться</Link></p>
//         </div>
//     );            
// }

// export default Login;

    


