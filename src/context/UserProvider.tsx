import { useState } from "react";
import type { ReactNode } from 'react';
import { UserContext } from "./UserContext";
import type { User } from './UserContext';

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  
    const [user, setUser] = useState<User>(() => {
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                console.error("Ошибка чтения user_data:", e);
            }
        }
        return {
            name: 'Алексей Иванов',
            role: 'Employee',
            department: 'RPO',
            monthlyHoursLimit: 20,
            usedHours: 0
        };
    });

    const deductHours = (hours: number): boolean => {
        if (user.usedHours + hours > user.monthlyHoursLimit){
            return false;
        }
        
        // запись в localStorage
        setUser(prev => {
            const updated = { ...prev, usedHours: prev.usedHours + hours };
            localStorage.setItem('user_data', JSON.stringify(updated));
            return updated;
        });
        
        return true;
    };

    const refundHours = (hours: number) => {
        setUser(prev => {
            const updated = { ...prev, usedHours: Math.max(0, prev.usedHours - hours) };
            localStorage.setItem('user_data', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <UserContext.Provider value={{user, deductHours, refundHours}}>
            {children}
        </UserContext.Provider>
    );
};
