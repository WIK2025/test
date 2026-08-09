import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface BookingRecord {
    id: string;
    resourceName: string;
    time: string;
    date: string;
    status: 'Confirmed' | 'Cancelled';
}

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);
    if (!userCtx) throw new Error("UserContext не найден");
    const { user } = userCtx;
    
    // активные бронирования для вывода
    const [upcoming] = useState<BookingRecord[]>(() => {
        const saved: BookingRecord[] = JSON.parse(localStorage.getItem('user_bookings') || '[]');
        return saved.filter(b => b.status === 'Confirmed');
    });

    // расчет загруженности
    const dynamicOccupancy = Math.min(95, 40 + Math.round((upcoming.length / 47) * 100));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* приветствие */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Привет, Алексей!</h1>
                <p className="text-gray-500 mt-1">Добро пожаловать в рабочее пространство Workspace Flow.</p>
            </div>

            {/* сетка  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* левая карточка */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-48">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ВАШ БАЛАНС</span>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">Доступные часы</h2>
                    </div>
                    <div className="flex items-baseline gap-1 mt-auto">
                        <span className="text-4xl font-black text-indigo-600">
                            {user.monthlyHoursLimit - user.usedHours}
                        </span>
                        <span className="text-sm font-medium text-gray-400">
                            / {user.monthlyHoursLimit} ч
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                        <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${((user.monthlyHoursLimit - user.usedHours) / user.monthlyHoursLimit) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* правая карточка*/}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-48">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">СТАТИСТИКА ХАБА</span>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">Загруженность офиса сегодня</h2>
                    </div>
                    <div className="mt-auto">
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="text-gray-500 font-medium">Занято рабочих зон</span>
                            <span className="font-bold text-gray-900">{dynamicOccupancy}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${dynamicOccupancy}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-3">
                        Пик загрузки ожидается в 14:00. Рекомендуем бронировать переговорные заранее.
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* левый нижний блок*/}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[200px]">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Ближайшие бронирования</h3>
                        
                        {upcoming.length === 0 ? (
                            <div className="text-sm text-gray-400 py-10 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                У вас нет активных бронирований на ближайшее время.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcoming.slice(-2).reverse().map((b) => (
                                    <div key={b.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{b.resourceName}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{b.date} • {b.time}</p>
                                        </div>
                                        <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold border border-green-100">
                                            Активно
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* правый нижний блок */}
                <div className="bg-indigo-600 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg min-h-[200px]">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Нужно рабочее место?</h3>
                        <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
                            Найдите свободный hot-desk или уединенную комнату на любом этаже в пару кликов.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/booking')}
                        className="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm text-center shadow-sm mt-4"
                    >
                        Забронировать ресурс
                    </button>
                </div>

            </div>
        </div>
    );
};
