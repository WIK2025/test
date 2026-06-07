import React from "react";
import ReactDatePicker, {registerLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import styles from './DataPicker.module.css';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ru', ru);

const DataPicker = ({ value, onChange }) => {
    const dateValue = value ? new Date(value) : null;

    const handleDateChange = (date) => {
        if (!date) {
            onChange('');
            return;
        }
        const formattedDate = date.toLocaleDateString('en-CA'); 
        onChange(formattedDate);
    }
    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>Дата вылета</label>
            <ReactDatePicker 
                selected={dateValue}
                onChange={handleDateChange}
                locale="ru"
                minDate={new Date()}
                placeholderText="Выберите дату"
                dateFormat='dd.MM.yyyy'
                isClearable 
            />
        </div>
    );
};
export default DataPicker; 