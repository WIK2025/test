import React, { useRef, useState, useEffect } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

interface FilterState {
    search: string;
    date: string;
    type: 'all' | 'desk' | 'room';
    floor: 'all' | number;
    hasFlipchart: boolean;
    hasTypeC: boolean;
}

interface BookingFiltersProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({filters, setFilters}) => {
    const searchInput = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isFloorOpen, setIsFloorOpen] = useState(false);

    useEffect(()=>{
        if (searchInput.current){
            searchInput.current.focus();
        }
    }, []);
    useClickOutside(dropdownRef, () => setIsFloorOpen(false));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setFilters(prev => ({...prev, search: e.target.value}));
    };

    const handleCheckboxChange = (field: 'hasFlipchart' | 'hasTypeC')=>{
        setFilters(prev => ({...prev, [field]: !prev[field] }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, date: e.target.value}))
    };
     return (
        <div className='bg-white p-6 rounded-2xl border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-sm'>
            <div className='flex flex-col gap-1.5'>
                <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Поиск ресурса</label>
                <input 
                    ref={searchInput}
                    type='text'
                    value={filters.search}
                    onChange={handleInputChange}
                    placeholder="Введите например: Hot или Гамма"
                    className='w-full px-4 py-2 bg-gray-50 text-sm text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-500/30'
                />
            </div>

            {/* дата бронирования */}
            <div className='flex flex-col gap-1.5'>
                <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Дата бронирования</label>
                <input 
                    type='date'
                    value={filters.date}
                    onChange={handleDateChange}
                    className='w-full px-4 py-2 bg-gray-50 text-sm text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-500/30'
                />
            </div>

            {/* ресурс */}
            <div className='flex flex-col gap-1.5'>
                <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Тип ресурса</label>
                <div className='flex gap-1 border border-gray-100 rounded-xl p-1 bg-gray-50'>
                    {(['all', 'desk', 'room'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setFilters(prev => ({ ...prev, type: t }))}  
                            className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${filters.type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}  
                        >
                            {t === 'all' ? 'Все' : t === 'desk' ? 'Места' : 'Комнаты'}
                        </button>
                    ))}
                </div>
            </div>

            {/* этаж */}
            <div ref={dropdownRef} className='relative flex flex-col gap-1.5'>
                <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Этаж</label>
                <button
                    type="button"
                    onClick={() => setIsFloorOpen(!isFloorOpen)}
                    className='w-full text-left px-4 py-2 bg-gray-50 text-sm text-gray-700 rounded-xl focus:outline-none flex justify-between items-center border border-transparent'
                >
                    <span className="font-medium">{filters.floor === 'all' ? 'Все этажи' : `${filters.floor} этаж`}</span>
                    <span className="text-gray-400 text-xs">▼</span>
                </button>
                {isFloorOpen && (
                    <div className='absolute top-[100%] left-0 w-full mt-1 bg-white border border-gray-100 rounded-xl z-20 py-1 shadow-lg'>
                        {(['all', 1, 2, 3] as const).map((floor) => (
                            <button
                                key={floor}
                                type="button"
                                onClick={() => {
                                    setFilters(prev => ({ ...prev, floor: floor }));
                                    setIsFloorOpen(false);
                                }}
                                className='w-full text-left px-4 py-2 hover:bg-gray-50 text-xs font-medium text-gray-600'
                            >
                                {floor === 'all' ? 'Все этажи' : `${floor} этаж`}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* чекбоксы */}
            <div className='flex items-center gap-6 mt-5 md:col-span-2 pl-2'>
                <label className='flex items-center gap-2.5 text-xs font-semibold text-gray-600 cursor-pointer select-none'>
                    <input 
                        type='checkbox'
                        checked={filters.hasFlipchart}
                        onChange={() => handleCheckboxChange('hasFlipchart')}
                        className='w-4 h-4 text-indigo-600 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 bg-gray-50 cursor-pointer'
                    />
                    Есть флипчарт
                </label>
                <label className='flex items-center gap-2.5 text-xs font-semibold text-gray-600 cursor-pointer select-none'>
                    <input 
                        type='checkbox'
                        checked={filters.hasTypeC}
                        onChange={() => handleCheckboxChange('hasTypeC')}
                        className='w-4 h-4 text-indigo-600 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 bg-gray-50 cursor-pointer'
                    />
                    Type-C монитор
                </label>
            </div>
        </div>
    );

};