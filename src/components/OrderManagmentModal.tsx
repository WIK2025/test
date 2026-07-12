import React, { useState } from "react";
import { DeliveryStatus, DeliveryOrder } from "../types/delivery";
import { useDelivery } from "../context/DeliveryContext"; // импортируем context для получения курьеров

interface OrederManagmentModalProps {
    order: DeliveryOrder;
    onClose: () => void;
    onUpdateStatus: (orderId: string, nextStatus: DeliveryStatus) => void;
    // метод принимает courierId типа string 
    onAsignCourier: (orderId: string, courierId: string) => void;
}

export const OrederManagmentModal = ({
    order,
    onClose,
    onUpdateStatus,
    onAsignCourier
}: OrederManagmentModalProps) => { 
    //  храним ID курьера 
    const [selectedCourierId, setSelectedCourierId] = useState<string>(''); 
    
    // получаем список курьеров 
    const { state } = useDelivery();
    
    const allStatuses: DeliveryStatus[] = ['Pending', 'In_Transit', 'Delivered', 'Cancelled'];

    // выводим список  свободных курьеров 
    const freeCouriers = state.status === 'SUCCESS' 
        ? state.couriers.filter(c => c.currentOrderId === null) 
        : [];

    const handleCourierSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (!selectedCourierId) return; // проверяем что курьер выбран
        
        // передаем id курьера
        onAsignCourier(order.id, selectedCourierId);
        setSelectedCourierId(''); // сброс после назначения
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                 backgroundColor: '#ffffff',
                 padding: '24px',
                 width: '100%',
                 maxWidth: '500px',
                 borderRadius: '8px',
                 boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: "center",
                    marginBottom: '16px'
                }}>
                    <h3 style={{ margin: 0 }}>Управление заказом №{order.id}</h3>
                    <button onClick={onClose} style={{ 
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}>&times;</button>
                </div>

                <p style={{ color: '#4b5563', marginBottom: '16px' }}>
                    <b>Текущий адрес доставки:</b> {order.customAddress} 
                </p>

                {/*  смена статуса */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Изменить статус на:</label>
                    <select 
                        value={order.status} 
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as DeliveryStatus)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        {allStatuses.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* назначения курьера */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Назначить нового курьера:</label>
                    <form onSubmit={handleCourierSubmit} style={{ display: 'flex', gap: '8px' }}> 
                        {/* выпадающий список  */}
                        <select
                            value={selectedCourierId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourierId(e.target.value)}
                            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
                        >
                            <option value="" disabled>-- Выберите свободного курьера --</option>
                            {freeCouriers.map(courier => (
                                <option key={courier.id} value={courier.id}>
                                    {courier.name} ({courier.transport})
                                </option>
                            ))}
                        </select>
                        
                        <button type="submit" style={{
                            backgroundColor: '#4f46e5',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Назначить
                        </button>
                    </form>

                    {/* вывод текущего курьера, если он назначен */}
                    {order.assignedCourier && (
                        <p style={{ color: '#059669', marginTop: '8px', fontSize: '14px' }}>
                            ✓ Сейчас заказ выполняет: <b>{order.assignedCourier.name}</b>
                        </p>
                    )}
                </div>
                
                <button onClick={onClose} style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>Готово</button>
            </div>
        </div>
    );
};
