import React, { useState, useEffect } from 'react'
import TickedCard from './components/TickedCard/TickedCard'
import Search from './components/Search/Search';
import DataPicker from './components/DataPicker/DataPicker';
import Loader from './components/Loader/Loader'; 
import styles from './App.module.css';


function App() {
  const [tickets, setTickets] = useState([]); 
  const [loading, setLodading] = useState(false);
  const [origin, setOrigin] = useState('MOW');
  const [destination, setDestination] = useState('LED');
  const [departDate, setDeparteDate] = useState('');

  useEffect(()=>{
    const fetchData = async () => {
    setLodading(true);  
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `https://api.travelpayouts.com/v2/prices/latest?origin=${origin}&destination=${destination}&token=c4c4803704e456e75677a1714b230275`;
    
    try{
    const response = await fetch(proxy+apiUrl);
    if (response.ok){
      const data = await response.json();
      if (data.success) {
        let allTickets = data.data;
        if (departDate){
          allTickets = allTickets.filter(ticket => ticket.depart_date === departDate);
        }
        setTickets(allTickets);
      }
    }} catch (error){
      console.error('Ошибка загрузки данных:', error);
    }finally {
      setLodading(false);
    }
  };
    
    fetchData();
  }, [origin, destination, departDate])

  return (
    <div className={styles.container}>
      <h1>Поиск билетов</h1>
      <div className={styles.searchBar}>
        <Search 
            placeholder='введите город отправления'
            onSelect={setOrigin}
        /> 
        <Search 
          placeholder='введите назначения'
          onSelect={setDestination}
        />
        <DataPicker 
          value={departDate}
          onChange={setDeparteDate}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
      <div className={styles.grid}>
      {
        tickets.map((ticket, index) => (
        <TickedCard key={index} data={ticket} />
        ))
      }
      </div>
      )}
    </div>
  )
}

export default App;