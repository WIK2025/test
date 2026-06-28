import { useContext, useRef } from 'react'; // <-- Импортируем useRef!
import { CVContext } from '../context/CVContext';

function PreviewPanel() {
  const { state } = useContext(CVContext);
  
  // Создаем "лазерную указку" для нашего блока резюме
  const previewRef = useRef(null);

  const hasExperience = state.experience.some(item => item.company || item.role || item.years);
  const hasEducation = state.education && state.education.some(item => item.school || item.degree || item.year);


  // Функция, которая запускает печать в браузере
  const handlePrint = () => {
    window.print(); // Вызывает системное окно печати/сохранения в PDF
  };

  return (
    <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
      
      {/* Кнопка печати, которую мы скроем при самой печати */}
      <button 
        onClick={handlePrint}
        className="no-print" // Класс-метка, чтобы спрятать кнопку на листе бумаги
        style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        🖨️ Распечатать резюме / PDF
      </button>

      {/* Направляем нашу лазерную указку ref на этот контейнер. 
          Добавляем специальный класс, который будет виден принтеру */}
      <div ref={previewRef} className="preview-to-print" style={{ marginTop: '10px' }}>
        
        {/* ФИО */}
        <h1 style={{ color: state.personalInfo.fullName ? '#333' : '#aaa', margin: '0 0 10px 0' }}>
          {state.personalInfo.fullName ? state.personalInfo.fullName : 'Имя не указано'}
        </h1>

        {/* Контакты */}
        <p style={{ margin: '5px 0' }}><strong>Email:</strong> {state.personalInfo.email || 'не указан'}</p>
        <p style={{ margin: '5px 0' }}><strong>Телефон:</strong> {state.personalInfo.phone || 'не указан'}</p>

        {/* Условный рендеринг секции опыта */}
        {hasExperience && (
          <div style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '10px' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Опыт работы</h3>
            
                  {/* Условный рендеринг секции образования через && */}
      {hasEducation && (
        <div style={{ marginTop: '25px' }}>
          <h3 style={{ color: '#800020', textTransform: 'uppercase', borderBottom: '1px solid #800020', paddingBottom: '3px' }}>Образование</h3>
          {state.education.map((item) => (
            <div key={item.id} style={{ marginBottom: '15px' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>{item.school || 'Учебное заведение не указано'}</p>
              <p style={{ margin: '2px 0', color: '#555' }}>{item.degree ? `Специальность: ${item.degree}` : ''}</p>
              <p style={{ margin: '0', fontSize: '0.9em', color: '#777' }}>{item.year}</p>
            </div>
          ))}
        </div>
      )}



            {state.experience.map((item) => (
              <div key={item.id} style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0', fontWeight: 'bold' }}>
                  {item.company || 'Компания не указана'}
                </p>
                <p style={{ margin: '2px 0', color: '#555' }}>
                  {item.role ? `Должность: ${item.role}` : ''}
                </p>
                <p style={{ margin: '0', fontSize: '0.9em', color: '#777' }}>
                  {item.years}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default PreviewPanel;
