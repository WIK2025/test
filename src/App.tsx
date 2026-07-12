import { useState } from 'react';

import { DeliveryProvider, useDelivery } from './context/DeliveryContext';
import { GenericList } from './components/GenericList';
import { DeliveryCard } from './components/DeliveryCard';
import { CourierManager } from './components/CourierManager';
import { QuickSearch } from './components/QuickSearch';
import { OrederManagmentModal } from './components/OrderManagmentModal'; 

const DashboardConsole = () => {
    const { state, assignCourierToOrder, updateOrderStatus } = useDelivery();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    if (state.status === 'LOADING') return <h2>Загрузка данных доставки...</h2>;
    if (state.status === 'ERROR') return <h2>Ошибка: {state.message}</h2>;

    //базовый массив заказов
    const allOrders = state.status === 'SUCCESS' ? state.data : [];
    
    // фильтрация по адресу
    const filteredOrders = allOrders.filter(order => 
        order.customAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
    const activeOrder = allOrders.find(order => order.id === selectedOrderId);

    return (
        <div style={{ 
             maxWidth: '1200px',
             margin: '0 auto',
             padding: '24px' }}>
            <header style={{ borderBottom: '3px solid #4f46e5', paddingBottom: '12px', marginBottom: '24px' }}>
                <h1>Delivery Dashboard</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div>
                    <QuickSearch onSearchSubmit={(query) => setSearchQuery(query)} />
                    
                    <h2>Активные заказы</h2>
                    <GenericList
                        items={filteredOrders}
                        emptyPlaceholder='Заказы не найдены'
                        renderItem={(order) => (
                            <DeliveryCard
                                order={order}
                                onSelectedOrder={(id) => setSelectedOrderId(id)}
                            />
                        )}
                    />
                </div>
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
                    <h3>Статистика</h3>
                    <p>Найдено заказов: {filteredOrders.length}</p>
                    <p>Всего заказов в системе: {allOrders.length}</p>
                </div>
                <div>
                    <h2>Персонал</h2>
                    <CourierManager/>
                </div>
            </div>

            {activeOrder && (
                <OrederManagmentModal
                    order={activeOrder}
                    onClose={() => setSelectedOrderId(null)}
                    onUpdateStatus={updateOrderStatus}
                    onAsignCourier={assignCourierToOrder}
                />
            )}
        </div>
    );
};

function App() {
    return (
        <DeliveryProvider>
            <DashboardConsole />
        </DeliveryProvider>
    );
}

export default App;
