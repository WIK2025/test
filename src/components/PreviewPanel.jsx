import { useContext } from 'react';
import { CVContext } from '../context/CVContext';

function PreviewPanel() {
  // 1. Подключаемся к контексту, чтобы забрать текущий state
  const { state } = useContext(CVContext);

  return (
    <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
      <h2>Превью резюме</h2>
      
      <div style={{ marginTop: '20px' }}>
        {/* рендерим ФИО через тернарный оператор */}
        <h1 style={{ color: state.personalInfo.fullName ? '#333' : '#aaa' }}>
          {state.personalInfo.fullName ? state.personalInfo.fullName : 'Имя не указано'}
        </h1>

        {/* Вывод Email и Телефона */}
        <p><strong>Email:</strong> {state.personalInfo.email || 'не указан'}</p>
        <p><strong>Телефон:</strong> {state.personalInfo.phone || 'не указан'}</p>
      </div>

    </div>
  );
}

export default PreviewPanel;
