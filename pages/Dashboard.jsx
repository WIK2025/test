import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Dashboard() {
    return (
        <>
            <aside>
                <h3>Кабинет автора</h3>
                <ul>
                    <li><Link to='/dashboard/profile'>Мой профиль</Link></li>
                    <li><Link to='/dashboard/settings'>Настройки</Link></li>
                </ul>
            </aside>
            <section>
                <h2>Добро пожаловать в панель управления!</h2>
                <div>
                    <Outlet />
                </div>
            </section>
        </>
    );
}

export default Dashboard;

// import { Link, Outlet } from 'react-router-dom';

// function Dashboard() {
//     return (
//         <>
//             <aside>
//                 <h3>Кабинет автора</h3>
//                 <ul>
//                     <li><Link to='/dashboard/profile'>Мой профиль</Link></li>
//                     <li><Link to='/dashboard/settings'>Настройки</Link></li>
//                 </ul>
//             </aside>
//             <section>
//                 <h2>Добро пожаловать в панель управления!</h2>
//                 <div>
//                     <Outlet />
//                 </div>
//             </section>
//         </>
//     );
// }

// export default Dashboard;
