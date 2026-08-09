import { createContext} from "react";

export interface User {
    name: string;
    role: 'Employee' | 'Admin';
    department: string;
    monthlyHoursLimit: number;
    usedHours: number;
}
interface UserContextType {
    user: User;
    deductHours: (hours: number) => boolean;
    refundHours: (hours: number) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
