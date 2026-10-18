import { useState, useEffect } from "react";

// указываем домен, и порт 8000 и шлюз /api/ для кук
const API_BASE_URL = 'http://localhost:8000/api/'; 

function App() {
  // храним массив записей настроения
  const [points, setPoints] = useState([]); 
  //  вывода статистики 
  const [stats, setStats] = useState({ total_count: 0, streak: 0, dominant_mood_emoji: "😐", prediction: "" });

  // храним ключ настроения 
  const [selectedPointId, setSelectedPointId] = useState('great'); 
  // заметка до 140 символов                      
  const [userLat, setUserLat] = useState('');                      

  // стейт для теста дат 
  const [simulatedDate, setSimulatedDate] = useState('');

  // состояние вывода сетевых ошибок 
  const [error, setError] = useState(null);
  // индикатор загрузки 
  const [loading, setLoading] = useState(false);

  // функция состояния сессии
  const fetchDiaryData = () => {
    
    fetch(`${API_BASE_URL}points/`, { credentials: 'include' }) 
    .then((res) => {
      // если сессия упала, выводим ошибку
      if (!res.ok) throw new Error('Ошибка загрузки дневника из сессии');
      return res.json();
    })
    .then((data) => {
      // превращаем JSON объект в массив
      setPoints(Object.entries(data.entries || {}));
      // запись  статистики в стейт
      setStats(data.stats);
    })
    .catch((err) => setError(err.message));
  };
 
  useEffect(() => {
    fetchDiaryData();
  }, []);

  // Левая ПАнЕль НАСТРОЙКИ  обработчик сохранения настроения
  const handleCalculate = (e) => {
    e.preventDefault(); // блокируем дефолтную перезагрузку страницы 
    setLoading(true); // режим ожидания 
    setError(null); //сбрасываем ошибки перед запросом

    // JSON для передачи на сервер 
    const payload = {
      "mood": selectedPointId, 
      "note": userLat,
      "custom_date": simulatedDate // передаем случайную дату
    };

    // отправляем асинхронный POST запрос в бд
    fetch(`${API_BASE_URL}calculate_shipping/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // шлем JSON данные
      },
      credentials: 'include', 
      body: JSON.stringify(payload) // сериализуем JSON
    })
    .then((res) => {
      if (!res.ok) throw new Error('Ошибка при сохранении записи');
      return res.json();
    })
    .then(() => {
      setUserLat(""); // очищаем поле ввода после сохранения
      setSimulatedDate(""); // сбрасываем дату для проверки
            
      // фиксим изменения сессии в бд
      setTimeout(() => {
        fetchDiaryData(); 
        setLoading(false); // выключаем режим блокировки кнопок
      }, 150);
    })
    .catch((err) => {
      setError(err.message); // вывод ошибки
      setLoading(false); // разблокировка интерфейса для новой попытки
    });
  };

  // полная очистка текущей сессии
  const handleReset = () => {
    // окно-подтверждение в браузере
    if (!window.confirm("Полностью стереть историю настроений?")) return;
    
    //эндпоинт очистки словаря сессии
    fetch(`${API_BASE_URL}reset/`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' // передаем куку include
    })
    .then(() => fetchDiaryData()) // перерисовываем экран 
    .catch((err) => setError(err.message));
  };

      return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#f5f6fa',
      fontFamily: 'Segoe UI, sans-serif', 
      padding: '10px', 
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%', maxWidth: '780px', backgroundColor: '#ffffff',
        borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', padding: '20px', boxSizing: 'border-box'
      }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '15px', marginTop: 0, fontSize: '1.6em', lineHeight: '1.2' }}>
          🧘‍♂️ Анонимный дневник настроения
        </h1>
        
        {error && (
          <div style={{ backgroundColor: '#ffeaec', color: '#e74c3c', padding: '8px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center', fontSize: '13px' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          
          {/* Левая ПАнЕль НАСТРОЙКИ */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }}>
            <h3 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '6px', marginBottom: '15px', marginTop: 0, fontSize: '1.1em' }}>Настройки дневника</h3>
            
            <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '13px' }}>Выбери настроение на сегодня:</label>
                <select 
                  value={selectedPointId}
                  onChange={(e) => setSelectedPointId(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '13px', outline: 'none' }}
                >
                  <option value="great">😊 Отлично (Great)</option>
                  <option value="good">🙂 Хорошо (Good)</option>
                  <option value="neutral">😐 Нормально (Neutral)</option>
                  <option value="bad">🙁 Плохо (Bad)</option>
                  <option value="awful">😫 Ужасно (Awful)</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '13px' }}>Короткая заметка:</label>
                  <small style={{ color: userLat.length > 140 ? 'red' : '#95a5a6', fontSize: '11px' }}>{userLat.length}/140</small>
                </div>
                <input 
                  type="text" 
                  maxLength={140}
                  value={userLat} 
                  onChange={(e) => setUserLat(e.target.value)} 
                  placeholder="Как прошел день?..."
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '13px' }}> Выбор Даты(для теста):</label>
                <input 
                  type="date" 
                  value={simulatedDate} 
                  onChange={(e) => setSimulatedDate(e.target.value)} 
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                style={{ padding: '10px', background: loading ? '#95a5a6' : '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                {loading ? 'Сохраняем...': 'Сохранить настроение'}
              </button>
            </form>
            
            <button 
              onClick={handleReset} 
              style={{ marginTop: '10px', padding: '8px', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
            >
              🗑️ Очистить историю сессии
            </button>
          </div>
          
          {/* Правая ПАнЕль НАСТРОЙКИ */}
          <div style={{ flex: '1 1 280px', background: '#2c3e50', color: '#fff', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <h3 style={{ color: '#ecf0f1', marginTop: 0, borderBottom: '1px solid #34495e', paddingBottom: '6px', marginBottom: '15px', fontSize: '1.1em' }}>Статистика и Неделя:</h3>
            
            <div style={{ fontSize: '13px', marginBottom: '15px', backgroundColor: '#34495e', padding: '8px', borderRadius: '6px', lineHeight: '1.4' }}>
              <p style={{ margin: '3px 0' }}>🔥 <b>Дней подряд (Streak):</b> {stats.streak}</p>
              <p style={{ margin: '3px 0' }}>👑 <b>Частое настроение:</b> {stats.dominant_mood_emoji}</p>
              <p style={{ margin: '3px 0' }}>📝 <b>Всего записей:</b> {stats.total_count}</p>
              <p style={{ margin: '3px 0', fontStyle: 'italic', color: '#2ecc71', fontSize: '12px' }}>🔮 {stats.prediction}</p>
            </div>

            <h4 style={{ color: '#ecf0f1', margin: '0 0 8px 0', fontSize: '0.95em' }}>История (последние 7 дней):</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '140px', paddingRight: '2px' }}>
              {points.length > 0 ? (
                (() => {
                  const rows = [];
                  for (let i = 0; i < points.length; i++) {
                    const date = points[i][0];
                    const entry = points[i][1];
                    rows.push(
                      <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#34495e', padding: '6px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '1.3em' }}>{entry.mood_emoji}</span>
                        <div style={{ overflow: 'hidden' }}>
                          <small style={{ color: '#bdc3c7', display: 'block', fontSize: '10px' }}>{date}</small>
                          <span style={{ fontSize: '11px', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{entry.note || 'Без заметки'}</span>
                        </div>
                      </div>
                    );
                  }
                  return rows;
                })()
              ) : (
                <p style={{ color: '#bdc3c7', fontStyle: 'italic', margin: 0, textAlign: 'center', fontSize: '12px' }}>История пуста</p>
              )}
            </div>
          </div>  
          
        </div>
      </div>
    </div>
  );
}

export default App;
