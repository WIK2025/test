import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useClickOutside } from '../hooks/useClickOutside';

export interface FilterState {
    search: string;
    date: string;
    type: 'all' | 'desk' | 'room';
    floor: 'all' | number;
    hasFlipchart: boolean;
}

interface BookingFiltersProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({ filters, setFilters }) => {

    const searchInput = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isFloorOpen, setIsFloorOpen] = useState(false);

    
    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus(); // Устанавливаем фокус при монтировании
        }
    }, []);

    
    useClickOutside(dropdownRef, () => setIsFloorOpen(false));

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, date: e.target.value }));
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {/* блок поиска */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Поиск ресурса</label>
                <input 
                    ref={searchInput}
                    value={filters.search} 
                    type="text" 
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* блок даты */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Дата бронирования</label>
                <input 
                    value={filters.date} 
                    type='date' 
                    onChange={handleDateChange}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

       
            <div className="flex gap-2 border-b border-gray-200 pb-3">
                {(['all', 'desk', 'room'] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setFilters(prev => ({ ...prev, type: t }))}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                            filters.type === t 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {t === 'all' ? 'Все' : t === 'desk' ? 'Места' : 'Комнаты'}
                    </button>
                ))}
            </div>

            
            <div ref={dropdownRef} className="relative flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Этаж</label>
                <button
                    type="button"
                    onClick={() => setIsFloorOpen(!isFloorOpen)}
                    className="w-full text-left border border-gray-300 rounded px-3 py-1.5 bg-white flex justify-between items-center hover:bg-gray-50"
                >
                    <span>
                        {filters.floor === 'all' ? 'Все этажи' : `${filters.floor} этаж`}
                    </span>
                    <span className="text-xs text-gray-400">▼</span>
                </button>

                {/* выпадающий список */}
                {isFloorOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 flex flex-col">
                        {(['all', 1, 2, 3] as const).map((floor) => (
                            <button
                                key={floor}
                                type="button"
                                onClick={() => {
                                    setFilters(prev => ({ ...prev, floor: floor }));
                                    setIsFloorOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${
                                    filters.floor === floor ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                                }`}
                            >
                                {floor === 'all' ? 'Все этажи' : `${floor} этаж`}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
