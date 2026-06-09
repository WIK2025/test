import React, {useState, useEffect} from 'react';
import { DiVim } from 'react-icons/di';
import styles from 'Search.module.css';

function Search({placeholder, onSelect}) {
    const[inputValue, setInputValue] = useState('');
    const [citis, setCitis] = useState([]);
    
    useEffect(()=>{
        const fetchCitis = async () => {
            // https://autocomplete.travelpayouts.com/places2?locale=en&types[]=airport&types[]=city&term=lond
            if (inputValue > 1) {
                const apiURL = `https://autocomplete.travelpayouts.com/places2?term={inputValue}&locale=ru&types[]=city`
                const response = await fetch (apiURL);
                if (response.ok) {
                    const data = await response.json();
                    setCitis(data);
                }
                else if (inputValue <=1){
                    setCitis([]);
                }
            }
        }
        fetchCitis();

    }, [inputValue]);

    const handleSelect = (cityCode, cityName) =>{
        setCitis([]);
        setInputValue(cityName);
        onselect(cityCode); // передаем код родителю
    };


    return (
        <div className={styles.container}>
            <input
             type="text" 
             className={styles.input}
             placeholder={placeholder}
             onInput={(e)=> {
                setInputValue(e.target.value);
                }}
            />
            <ul>
            { inputValue.lenght > 1 && (
                citis.map((city) => (
                    <li
                    key={city.code}
                    onClick={()=>handleSelect(city.code, city.name)}
                    >
                    <span>{city.name}</span> 
                    <span>{city.code}</span>                    
                    </li>
                ))
            ) }
            </ul>
        </div>            
    );
}

export default Search;