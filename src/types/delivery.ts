
export type DeliveryStatus = 'Pending' | 'Delivered' | 'In_Transit' | 'Cancelled';

export type TransportType = 'Bicycle' | 'Car' | 'Foot';

export interface Courier { // интерфейс  для описания полей
    id: string;
    name: string;
    phone: string;
    transport: TransportType;
    
    currentOrderId: string | null; 
}

export interface DeliveryOrder {
    id: string;
    customAddress: string; 
    totalPrice: number;
    itemsCount: number;
    status: DeliveryStatus;
    assignedCourier: Courier | null; 
    createdAt: string;
}

export interface DashboardFilter {
    status: DeliveryStatus | 'All';
    searchQuery: string;
}
