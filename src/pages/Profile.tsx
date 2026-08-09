import React, {useContext, useState} from "react";
import { UserContext } from "../context/UserContext";

interface BookingRecord {
    id: string;
    resourceName: string;
    resourceType: 'desk' | 'room';
    floor: number;
    time: string;
    date: string;
    hour: number;
    status: 'Confirmed' | 'Cancelled';
}

export const Profile: React.FC = () => {
    const userCtx = useContext(UserContext);
    if (!userCtx) throw new Error("UserContext не найден");
    const {user, refundHours} = userCtx;
    const [bookings, setBookings] = useState<BookingRecord[]>(()=>{
        return JSON.parse(localStorage.getItem('user_bookings')||'[]');
    });
    const handleCancelBooking = (bookingId:string, hourToRefund: number) => {
        refundHours(hourToRefund);
        const updateBookings = bookings.map(b=>
            b.id === bookingId ? {...b, status: 'Cancelled' as const} : b
        );
        setBookings(updateBookings);
        localStorage.setItem('user_bookings', JSON.stringify(updateBookings));
    };

        return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* карточка пользователя */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-sm text-gray-400 font-medium">{user.department} • {user.role}</p>
                    </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-5">
                    <div className="flex justify-between items-baseline text-sm mb-1.5">
                        <span className="text-gray-500 font-medium">Использовано лимита:</span>
                        <span className="font-bold text-gray-900">{user.usedHours} из {user.monthlyHoursLimit} ч.</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(user.usedHours / user.monthlyHoursLimit) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* таблица истории бронирования */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="text-md font-bold text-gray-900">История ваших бронирований:</h2>
                </div>
                
                {bookings.length === 0 ? (
                    <div className="text-sm text-gray-400 py-12 text-center bg-gray-50 m-5 rounded-lg border border-dashed border-gray-200">
                        Вы еще ничего не бронировали
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ресурс</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Дата/Время</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Списание</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Статус</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Действие</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...bookings].reverse().map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900 text-sm">{b.resourceName}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {b.floor} этаж • {b.resourceType === 'room' ? 'Переговорная' : 'Место'}
                                            </p>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-600">
                                            <p>{b.date}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{b.time}</p>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-indigo-600">{b.hour} ч.</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                b.status === 'Confirmed' 
                                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                                    : 'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                                {b.status === 'Confirmed' ? 'Подтверждено' : 'Отменено'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {b.status === 'Confirmed' ? (
                                                <button
                                                    onClick={() => handleCancelBooking(b.id, b.hour)}
                                                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    Отменить
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium italic pr-2">Завершено</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
