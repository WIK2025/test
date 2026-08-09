export interface Resource {
    id: string;
    name: string;
    type: 'desk' | 'room';
    floor: number;
    features: string[];
}

export const mockResources: Resource[] = [
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

    ...Array.from({length: 45}).map((_, index)=>({
        id: `generated-${index}`,
        name: index % 2 === 0 ? `Hot Desk B-${index}` : `Гамма-${index}`,
        type: index % 2 === 0 ? ('desk' as const) : ('room' as const),
        floor: (index % 3 )+ 1,
        features: index % 3 === 0 ? ['Type-C монитор', 'Флипчарт'] : ['Флипчарт']
    }))
];