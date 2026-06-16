import React from 'react';
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <>
            <h1>Ошибка 404</h1>
            <p>Страница, которую вы ищете, куда-то исчезла...</p>
            <Link to='/news'>⏹️ Вернуться в ленту новостей</Link>
        </>
    );
}

export default NotFound;

// import { Link } from "react-router-dom";

// function NotFound() {
//     return (
//         <>
//             <h1>Ошибка 404</h1>
//             <p>Страница, которую вы ищете, куда-то исчезла...</p>
//             <Link to='/news'>⏹️Вернуть в ленту новостей</Link>
//         </>
//     );
// }; 

// export default NotFound;