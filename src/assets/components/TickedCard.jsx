import React from 'react';
import styles from './TickedCard.module.css';

function TickedCard ({data})  {
    //"2026-05-13"
    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        const date = new Date(dateString); // создаем объект
        return data.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year:'numeric'
        });
    }
    return (
       
        <div className={styles.container}>
            <div className={styles.destination}>
                 {date.origin} -{data.destination}
            </div>
            <div className={styles.price}>
                {data.value}            
            </div>

            <div className={styles.info}>
              {formatDate(date.depart_date)}            
            </div>
            <div className={styles.gate}>
                {date.gate}            
            </div>
            <button className={styles.btn}>Купить</button>        
        </div>
       
    );

}

export default TickedCard;