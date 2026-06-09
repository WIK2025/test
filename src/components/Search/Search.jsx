import React, {useState, useEffect} from "react";
import styles from './Search.module.css';

function Search({ placeholder, onSelect }){
    const [inputValue, setInputValue] = useState('');
    const [citis, setCitis] = useState([]);
    const [isVisible, setIsVisible] = useState(false); 
    const [shouldEffect, setShouldEffect] = useState(true);

    useEffect(()=>{
        const fetchCitis = async () => {
            if (shouldEffect && inputValue.length > 1){
                let apiUrl = `http://autocomplete.travelpayouts.com/places2?term=${inputValue}&locale=ru&types[]=city`;
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    setCitis(data);
                    setIsVisible(data.length > 0);
                }
               
              }
            else if (inputValue.length <= 1){
                setCitis([]);
                setIsVisible(false);
            }
        }
        fetchCitis();
    }, [inputValue, shouldEffect]);

    const handleSelect = (cityCode, cityName) =>{
        setShouldEffect(false)
        setIsVisible(false);
        setCitis([]);
        setInputValue(cityName);
        onSelect(cityCode); // передаем код родителю
    };

    return (
        <div className={styles.container}>
                <input 
                    type="text"
                    className={styles.input} 
                    placeholder={placeholder}
                    value={inputValue}
                    onBlur={() => setTimeout(()=>setIsVisible(false), 200)}
                    onChange={(e)=>{
                       setInputValue(e.target.value); 
                       setShouldEffect(true)
                       setIsVisible(true);
                    }}
                />
                <ul className={styles.list}>
                {isVisible && inputValue.length > 1 && (
                    citis.map((city) => (
                        <li
                            key={city.code}
                            onClick={()=>handleSelect(city.code, city.name)}
                            className={styles.item}
                        >
                            <span className={styles.city}>{city.name}</span>
                            <span className={styles.code}>{city.code}</span>
                        </li>
                    ))
                )}
                </ul>
            </div>
    );
}
export default Search;