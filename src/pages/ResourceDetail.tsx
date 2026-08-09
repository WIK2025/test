import React, { useReducer, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockResources } from "../mockData/mockData";
import { UserContext } from "../context/UserContext";
import { bookingReducer, initialState, TimeSlot } from "../components/BookingReducer";

const DAY_SLOTS: TimeSlot[] = [
    { id: 's8', time: '08:00-10:00', priceHours: 2 },
    { id: 's10', time: '10:00-12:00', priceHours: 2 },
    { id: 's12', time: '12:00-14:00', priceHours: 2 },
    { id: 's14', time: '14:00-16:00', priceHours: 2 },
    { id: 's16', time: '16:00-18:00', priceHours: 2 },
];

const OCCUPIED_SLOTS = ['s12'];

export const ResourceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);
    if (!userCtx) throw new Error('UserContext не найден');
    const { user, deductHours } = userCtx;
    const [state, dispatch] = useReducer(bookingReducer, initialState);
    const [bookingMessage, setBookingMessage] = useState<{ text: string, isError: boolean } | null>(null);

    const resource = mockResources.find(r => r.id === id);
    if (!resource) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">Ресурс не найден</p>
                <button 
                    onClick={() => navigate('/booking')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                    Вернуться к каталогу
                </button>
            </div>
        );
    }

    const totalHoursRequested = state.selectedSlots.reduce((sum, slot) => sum + slot.priceHours, 0);

    const handleConfirmBooking = () => {
        if (totalHoursRequested === 0) return;
        const success = deductHours(totalHoursRequested);
        if (success) {
            const currentBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
            const newBookings = state.selectedSlots.map(slot => ({
                id: `${resource.id}-${slot.id}-${Date.now()}`,
                resourceName: resource.name,
                resourceType: resource.type,
                floor: resource.floor,
                time: slot.time,
                date: new Date().toISOString().split('T')[0],
                hour: slot.priceHours,
                status: 'Confirmed'
            }));
            localStorage.setItem('user_bookings', JSON.stringify([...currentBookings, ...newBookings]));
            setBookingMessage({ text: '✅ Бронирование успешно подтверждено!', isError: false });
            dispatch({ type: 'CLEAR_CART' });
        } else {
            setBookingMessage({ text: '❌ Ошибка: Превышен ваш ежемесячный лимит часов!', isError: true });
        }
    };

       return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* кнопка назад */}
            <button 
                onClick={() => navigate('/booking')}
                className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
                ← Назад к каталогу
            </button>

            {/* макет */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* левая колонка */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* центральный блок */}
                    <div className="bg-white rounded-2xl border border-gray-100 h-64 flex items-center justify-center shadow-sm relative">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>

                    {/* блок расписания */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                        <h2 className="text-xl font-extrabold text-gray-900">{resource.name}</h2>
                        <p className="text-xs font-semibold text-amber-600 bg-amber-50 inline-block px-2.5 py-1 rounded-md mt-1.5">
                            {resource.floor} этаж • {resource.type === 'room' ? 'Комната' : 'Рабочая зона'}
                        </p>

                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-900">Интерактивное расписание</h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">Наведите на слот, чтобы увидеть детали, и кликните для выбора.</p>
                        </div>
                        
                        {/* сетка кнопок */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            {DAY_SLOTS.map((slot) => {
                                const isOccupied = OCCUPIED_SLOTS.includes(slot.id);
                                const isSelected = state.selectedSlots.some(s => s.id === slot.id);
                                
                                return (
                                    <button
                                        key={slot.id}
                                        disabled={isOccupied}
                                        type="button"
                                        onClick={() => dispatch({ type: 'TOGGLE_SLOT', payload: slot })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all h-16 ${
                                            isOccupied 
                                                ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                                    : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-xs font-bold font-mono">{slot.time.split('-')[0]}</span>
                                        <span className={`text-[10px] mt-0.5 font-medium ${isOccupied ? 'text-gray-300' : isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>
                                            {isOccupied ? 'Занят' : 'Свободен'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* правая колонка */}
                <div className="space-y-6">
                    
                    {/* лимита */}
                    <div className="bg-[#1e1e2d] text-white p-6 rounded-2xl shadow-lg border border-gray-800">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ВАШ ЛИМИТ</span>
                        <p className="text-xs font-semibold text-indigo-300 mt-0.5">{user.department === 'RPO' ? 'Software Engineering (RPO)' : user.department}</p>
                        
                        <div className="mt-5 flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-white">
                                {user.monthlyHoursLimit - user.usedHours}
                            </span>
                            <span className="text-xs font-medium text-gray-400">
                                / {user.monthlyHoursLimit} ч. осталось
                            </span>
                        </div>
                    </div>

                    {/* черновик */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[300px]">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-sm font-bold text-gray-900">Черновик</h2>
                                <span className="text-[10px] bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md font-bold">
                                    {state.selectedSlots.length} слотов
                                </span>
                            </div>

                            {state.selectedSlots.length === 0 ? (
                                /* текст заглушка */
                                <div className="text-xs text-gray-400 py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 px-4 leading-relaxed">
                                    Выберите доступные слоты времени слева.
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-1">
                                    {state.selectedSlots.map(slot => (
                                        <div key={slot.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{slot.time}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Стоимость: {slot.priceHours} ч.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => dispatch({ type: 'TOGGLE_SLOT', payload: slot })}
                                                className="text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-md transition-colors"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* блок итого */}
                        <div className="border-t border-gray-50 pt-4 mt-auto">
                            <div className="flex justify-between items-center mb-4 text-xs font-semibold">
                                <span className="text-gray-400">Итого к списанию:</span>
                                <span className="text-base font-black text-indigo-600">{totalHoursRequested} ч.</span>
                            </div>
                            
                            <button
                                type="button"
                                disabled={state.selectedSlots.length === 0}
                                onClick={handleConfirmBooking}
                                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-center transition-all ${
                                    state.selectedSlots.length === 0
                                        ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                }`}
                            >
                                Подтвердить бронирование
                            </button>

                            {bookingMessage && (
                                <div className={`mt-3 p-2.5 rounded-xl text-center text-[11px] font-semibold ${
                                    bookingMessage.isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                }`}>
                                    {bookingMessage.text}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );

};
