import { useContext } from 'react';
import { CVContext } from '../context/CVContext';

function PreviewPanel() {
  // Достаем из нашего беспроводного контекста склад (state) и курьера (dispatch)
  const { state, dispatch } = useContext(CVContext);

  return (
    <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Личная информация</h2>
      
      {/* Сюда мы сейчас добавим наши поля ввода (inputs) */}
      <p>Форма ввода данных резюме</p>
      
    </div>
  );
}

export default PreviewPanel;
