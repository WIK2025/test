import { useContext } from 'react';
import { CVContext } from '../context/CVContext';

import EducationInput from './EducationInput';

import ExperienceInput from './ExperienceInput';

function FormPanel() {
  const { state, dispatch } = useContext(CVContext);

  const handleInputChange = (fieldName, value) => {
    dispatch({
      type: 'UPDATE_PERSONAL',
      payload: { key: fieldName, value: value }
    });
  };

  //  поля работы
  const handleExperienceChange = (id, fieldName, value) => {
    dispatch({
      type: 'UPDATE_EXPERIENCE',
      payload: { id, key: fieldName, value }
    });
  };

  // карточка работы
  const handleAddExperience = () => {
    dispatch({ type: 'ADD_EXPERIENCE' });
  };
// функция  поля 
const handleEducationChange = (id, fieldName, value) => {
  dispatch({
    type: 'UPDATE_EDUCATION',
    payload: { id, key: fieldName, value }
  });
};

// функция для добавления пустой строки 
const handleAddEducation = () => {
  dispatch({ type: 'ADD_EDUCATION' });
};

  return (
    <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Личная информация</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>ФИО:</label>
        <input 
          type="text" 
          value={state.personalInfo.fullName} 
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input 
          type="email" 
          value={state.personalInfo.email} 
          onChange={(e) => handleInputChange('email', e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

            {/* поле ввода телефона  */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Телефон:</label>
        <input 
          type="tel" 
          value={state.personalInfo.phone || ''} 
          placeholder="Введите цифры (например, +79991234567)" 
          onChange={(e) => {
            const inputValue = e.target.value;
            // разрешаем только цифры, плюс, минус, пробел и скобки
            const cleanValue = inputValue.replace(/[^\d+() -]/g, '');
            handleInputChange('phone', cleanValue);
          }}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>


      <h2>Опыт работы</h2>
      
      {/* цикл  состояния */}
      {state.experience.map((item) => (
        <ExperienceInput 
          key={item.id} 
          item={item} 
          onChange={handleExperienceChange} 
        />
      ))}

      {/* кнопка  карточки */}
      <button 
        type="button" 
        onClick={handleAddExperience}
        style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        + Добавить место работы
      </button>
            <h2>Образование</h2>

      {/* цикл по массиву образования */}
      {state.education && state.education.map((item) => (
        <EducationInput 
          key={item.id} 
          item={item} 
          onChange={handleEducationChange} 
        />
      ))}

      {/* кнопка добавления новой строки обучения */}
      <button 
        type="button" 
        onClick={handleAddEducation}
        style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '25px' }}
      >
        + Добавить образование
      </button>

    </div>
  );
}

export default FormPanel;
