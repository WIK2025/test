function ExperienceInput({ item, onChange }) {
  return (
    <div style={{ padding: '10px', border: '1px dashed #aaa', marginBottom: '10px', backgroundColor: '#fff' }}>
      
      {/* поле ввода компании */}
      <div style={{ marginBottom: '5px' }}>
        <input 
          type="text" 
          placeholder="Компания" 
          value={item.company}
          onChange={(e) => onChange(item.id, 'company', e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
      </div>

      {/* поле ввода должности */}
      <div style={{ marginBottom: '5px' }}>
        <input 
          type="text" 
          placeholder="Должность" 
          value={item.role}
          onChange={(e) => onChange(item.id, 'role', e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
      </div>

      {/* поле ввода года работы */}
           
      <div>
        <input 
          type="text" 
          placeholder="Годы работы (например, 2022-2026)" 
          value={item.years || ''}
          onChange={(e) => {
            const inputValue = e.target.value;
            //разрешаем только цифры,дефис,минус для дат
            const cleanValue = inputValue.replace(/[^\d-]/g, '');
            onChange(item.id, 'years', cleanValue);
          }}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>


    </div>
  );
}

export default ExperienceInput;
