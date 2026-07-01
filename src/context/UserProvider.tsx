import React, { useState, ReactNode } from "react";
import { UserContext, User } from './UserContext'; 


export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({
        name: 'Алексей Иванов',
        role: 'Employee',
        department: 'PRO',
        monthHoursLimit: 20,
        usedHours: 0
    });

    const deductHours = (hours: number): boolean => {
        if (user.usedHours + hours > user.monthHoursLimit) {
            return false;
        }
        setUser(prev => ({ ...prev, usedHours: prev.usedHours + hours }));
        return true;
    };

    const refundHours = (hours: number) => {
        // Через обновление состояния устанавливаем новое значение
        setUser(prev => ({ ...prev, usedHours: Math.max(0, prev.usedHours - hours) })); 
    };

    return (
        <UserContext.Provider value={{ user, deductHours, refundHours }}>
            {children}
        </UserContext.Provider>
    );
};
