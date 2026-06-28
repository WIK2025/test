function EducationInput({ item, onChange }) {
  return (
    <div style={{ padding: '10px', border: '1px dashed #aaa', marginBottom: '10px', backgroundColor: '#fff' }}>
      
      {/* учебное заведение */}
      <div style={{ marginBottom: '5px' }}>
        <input 
          type="text" 
          placeholder="Учебное заведение (ВУЗ, Колледж)" 
          value={item.school || ''}
          onChange={(e) => onChange(item.id, 'school', e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
      </div>

      {/* специальность */}
      <div style={{ marginBottom: '5px' }}>
        <input 
          type="text" 
          placeholder="Специальность / Факультет" 
          value={item.degree || ''}
          onChange={(e) => onChange(item.id, 'degree', e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
      </div>

      {/* год окончания ввод только цифры */}
      <div>
        <input 
          type="text" 
          placeholder="ВВедите Год окончания (например, 2026)" 
          value={item.year || ''}
          onChange={(e) => {
            const cleanValue = e.target.value.replace(/[^\d]/g, ''); // разрешаем только цифры
            onChange(item.id, 'year', cleanValue);
          }}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

    </div>
  );
}

export default EducationInput;
