import React from "react";
import styles from './Loader.module.css';

const Loader = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.spinner}></div>

            <p>Ищем самые выгодные предложения...</p>
        </div>
    );
};

export default Loader;