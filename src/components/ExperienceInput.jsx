function ExperienceInput({ item, onChange }) {
  return (
    <div style={{ padding: '10px', border: '1px dashed #aaa', marginBottom: '10px', backgroundColor: '#fff' }}>
      
      {/* Поле ввода компании */}
      <div style={{ marginBottom: '5px' }}>
        <input 
          type="text" 
          placeholder="Компания" 
          value={item.company}
          onChange={(e) => onChange(item.id, 'company', e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
      </div>

      {/* Поле ввода должности */}
      <div style={{ marginBottom: '5px' }}>
        <input 
          type="text" 
          placeholder="Должность" 
          value={item.role}
          onChange={(e) => onChange(item.id, 'role', e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
      </div>

      {/* Поле ввода года работы */}
      <div>
        <input 
          type="text" 
          placeholder="Годы работы (например, 2022-2026)" 
          value={item.years}
          onChange={(e) => onChange(item.id, 'years', e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

    </div>
  );
}

export default ExperienceInput;
