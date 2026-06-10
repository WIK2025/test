import { useContext } from 'react';
import { CVContext } from '../context/CVContext';

function FormPanel() {
  // 1. Подключаемся к контекст
  const { state, dispatch } = useContext(CVContext);

  
  const handleInputChange = (fieldName, value) => {
    dispatch({
      type: 'UPDATE_PERSONAL',
      payload: { key: fieldName, value: value }
    });
  };

  return (
    <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Личная информация</h2>
      
      {/* Поле ввода ФИО */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>ФИО:</label>
        <input 
          type="text" 
          value={state.personalInfo.fullName} 
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      {/* Поле ввода Email */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input 
          type="email" 
          value={state.personalInfo.email} 
          onChange={(e) => handleInputChange('email', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      {/* Поле ввода Телефона */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Телефон:</label>
        <input 
          type="tel" 
          value={state.personalInfo.phone} 
          onChange={(e) => handleInputChange('phone', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

    </div>
  );
}

export default FormPanel;

