export interface Resource { // делаем типизацию ресурса
    id: string;
    name: string;
    type: 'desk' | 'room'; // desk - рабочее место, room - переговорка
    floor: number;
    features: string[]; 
}


export const mockResource: Resource[] = [
    {
        id: '1',
        name: 'Desk A-1',
        type: 'desk', 
        floor: 2,
        features: ['Type-C монитор']
    },
    {
        id: '2', 
        name: 'Переговорная Альфа',
        type: 'room', 
        floor: 3,
        features: ['Проектор', 'Маркерная доска', 'Флипчарт']
    },
];
