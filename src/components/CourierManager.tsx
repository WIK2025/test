import { useState } from "react";
import { TransportType } from "../types/delivery";
import { useDelivery } from "../context/DeliveryContext"; // импортируем контекст

export const CourierManager = () => {
    // получаем список курьеров из контекста
    const { state, addCourier } = useDelivery();
    const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);
    const [newCourierName, setNewCourierName] = useState<string>('');
    const [newCourierPhone, setNewCourierPhone] = useState<string>(''); //состояние телефона
    const [error, setError] = useState<string | null>(null); // состояние ошибок 

    const handleAddCourier = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); 

        const trimmedName = newCourierName.trim();
        const trimmedPhone = newCourierPhone.trim();

        //  ФИО
        if (trimmedName.length < 3) {
            setError('ФИО курьера должно быть не менее 3 символов.');
            return;
        }

        // телефон
        if (trimmedPhone.length < 5) {
            setError('Введите корректный номер телефона.');
            return;
        }

        //  транспорт
        if (!selectedTransport) {
            setError('Пожалуйста, выберите вид транспорта.');
            return;
        }

        addCourier(trimmedName, selectedTransport);
        setNewCourierName('');
        setNewCourierPhone(''); // очищаем поле телефона
        setSelectedTransport(null);
    };

    // получаем список курьеров 
    const currentCouriers = state.status === 'SUCCESS' ? state.couriers : [];

    return (
        <div style={{
            padding: '16px',
            border: '1px dashed #4f46e5',
            borderRadius: '8px'
        }}>
            <h3>Регистрация курьеров подразделения</h3>
            
            <form onSubmit={handleAddCourier} style={{
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column', 
                gap: '8px'
            }}>
                <input 
                    type="text"
                    value={newCourierName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourierName(e.target.value)}
                    placeholder="ФИО Курьера"
                    style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                
                <input 
                    type="text"
                    value={newCourierPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourierPhone(e.target.value)}
                    placeholder="Номер телефона"
                    style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                        style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
                        value={selectedTransport || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTransport(e.target.value as TransportType)}
                    >
                        <option value='' disabled>Выберите транспорт</option>
                        <option value='Foot'>Пешком</option>
                        <option value='Bicycle'>Велосипед</option>
                        <option value='Car'>Автомобиль</option>
                    </select>

                    <button type="submit" style={{
                        backgroundColor: '#10b981',
                        color: '#fff',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Добавить
                    </button>
                </div>
            </form>

            {/* вывод ошибки */}
            {error && (
                <div style={{ color: '#dc2626', fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>
                     {error}
                </div>
            )}

            <ul style={{ paddingLeft: '20px' }}>
                {currentCouriers.map(c => (
                    <li key={c.id} style={{ marginBottom: '6px' }}>
                        <b>{c.name}</b> ({c.phone}) — <i>{c.transport}</i> {' '}
                        {c.currentOrderId ? `(В пути: №${c.currentOrderId})` : '(Свободен)'}
                    </li>
                ))}
            </ul>
        </div>
    );
};
