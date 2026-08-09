import React from "react";
import { NavLink } from "react-router-dom";
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                Workspace Flow
            </div>
            <nav className={styles.navLinks}>
                <NavLink 
                    to='/'
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`} 
                >
                    Главная
                </NavLink>
                <NavLink 
                    to='/booking'
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`} 
                >
                    Бронирование
                </NavLink>
                <NavLink 
                    to='/profile'
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`} 
                >
                    Профиль
                </NavLink>
            </nav>
        </aside>
    )
}