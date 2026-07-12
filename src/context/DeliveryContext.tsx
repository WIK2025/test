import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type DeliveryStatus = 'Pending' | 'In_Transit' | 'Delivered' | 'Cancelled';
export type TransportType = 'Car' | 'Bicycle' | 'Foot';

export interface Courier {
    id: string;
    name: string;
    phone: string;
    transport: TransportType;
    currentOrderId: string | null;
}

export interface DeliveryOrder {
    id: string;
    customAddress: string;
    itemsCount: number;
    totalPrice: number;
    status: DeliveryStatus;
    assignedCourier: Courier | null;
    createdAt: string; 
}

export type DeliveryState = 
 | { status: 'LOADING' }
 | { status: 'SUCCESS'; data: DeliveryOrder[]; couriers: Courier[] }
 | { status: 'ERROR'; message: string };

// интерфейс контекста 
interface DeliveryContextType {
    state: DeliveryState;
    updateOrderStatus: (orderId: string, nextStatus: DeliveryStatus) => void;
    assignCourierToOrder: (orderId: string, courierId: string) => void;
    addCourier: (name: string, transport: TransportType) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

// начальные данные для первого запуска приложения 
const DEFAULT_ORDERS: DeliveryOrder[] = [
    {
        id: '101',
        customAddress: 'Lenina st',
        itemsCount: 3,
        totalPrice: 1500,
        status: 'Pending',
        assignedCourier: null,
        createdAt: '2026-06-22' 
    },
    {
        id: '102',
        customAddress: 'Sovetskaia st',
        itemsCount: 1,
        totalPrice: 4500,
        status: 'In_Transit',
        assignedCourier: {
            id: 'C1',
            name: 'Иван Петров',
            phone: '555-123',
            transport: 'Car',
            currentOrderId: '102'
        },
        createdAt: '2026-06-22' 
    }
];

const DEFAULT_COURIERS: Courier[] = [
    { id: 'C1', name: 'Иван Петров', phone: '555-123', transport: 'Car', currentOrderId: '102' },
    { id: 'C2', name: 'Алексей Сидоров', phone: '555-456', transport: 'Bicycle', currentOrderId: null }
];

const LOCAL_STORAGE_KEY = 'delivery_dashboard_state';

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
    // инициализация состояния 
    const [state, setState] = useState<DeliveryState>(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // инициализируем  SUCCESS
                return { status: 'SUCCESS', data: parsed.data, couriers: parsed.couriers };
            } catch (e) {
                console.error("Ошибка чтения localStorage", e);
            }
        }
        // первый запуск грузим дефолтные массивы
        return { status: 'SUCCESS', data: DEFAULT_ORDERS, couriers: DEFAULT_COURIERS };
    });

    // сохранение  состояния в localStorage 
    useEffect(() => {
        if (state.status === 'SUCCESS') {
            const dataToSave = {
                data: state.data,
                couriers: state.couriers
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
        }
    }, [state]);

    // регистрация нового курьера
    const addCourier = (name: string, transport: TransportType) => {
        if (state.status !== 'SUCCESS') return;

        const newCourier: Courier = {
            id: `C-${Date.now()}`,
            name,
            phone: '89990000000', 
            transport,
            currentOrderId: null
        };

        setState({
            ...state,
            couriers: [...state.couriers, newCourier]
        });
    };

    //  назначение курьера на заказ 
    const assignCourierToOrder = (orderId: string, courierId: string) => {
        if (state.status !== 'SUCCESS') return;

        // ищем курьера и проверяем свободен ли он
        const targetCourier = state.couriers.find(c => c.id === courierId);
        if (!targetCourier || targetCourier.currentOrderId !== null) {
            alert("Ошибка: этот курьер уже занят на другом заказе!");
            return; 
        }

        // обновляем массив курьеров
        const updatedCouriers = state.couriers.map(courier => 
            courier.id === courierId ? { ...courier, currentOrderId: orderId } : courier
        );

        // обновляем массив заказов
        const updatedOrders = state.data.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: 'In_Transit' as DeliveryStatus,
                    assignedCourier: { ...targetCourier, currentOrderId: orderId }
                };
            }
            return order;
        });

        setState({ status: 'SUCCESS', data: updatedOrders, couriers: updatedCouriers });
    };

    //  завершение или отмена заказа
    const updateOrderStatus = (orderId: string, nextStatus: DeliveryStatus) => {
        if (state.status !== 'SUCCESS') return;

        let updatedCouriers = [...state.couriers];

        //если статус меняется на Доставлен или Отменен
        if (nextStatus === 'Delivered' || nextStatus === 'Cancelled') {
            updatedCouriers = state.couriers.map(courier => 
                courier.currentOrderId === orderId ? { ...courier, currentOrderId: null } : courier
            );
        }

        const updatedOrders = state.data.map(order =>
            order.id === orderId ? { ...order, status: nextStatus } : order
        );

        setState({ status: 'SUCCESS', data: updatedOrders, couriers: updatedCouriers });
    };

    return (
        <DeliveryContext.Provider value={{ state, updateOrderStatus, assignCourierToOrder, addCourier }}>
            {children}
        </DeliveryContext.Provider>
    );
};

export const useDelivery = () => {
    const context = useContext(DeliveryContext);
    if (!context) throw new Error('useDelivery must be used within a DeliveryProvider');
    return context;
};
