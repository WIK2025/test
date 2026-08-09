export interface TimeSlot {
    id: string;
    time: string;
    priceHours: number;
} 

export interface BookingState{
    selectedSlots: TimeSlot[];
}

export type BookingAction = 
| {type: 'TOGGLE_SLOT'; payload: TimeSlot}
| {type: 'CLEAR_CART'}

export const initialState: BookingState = {
    selectedSlots: [],
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState{
    switch (action.type){
        case 'TOGGLE_SLOT':{
            const exists = state.selectedSlots.some(slot => slot.id === action.payload.id);
            if (exists){
                return {
                    ...state, 
                    selectedSlots: state.selectedSlots.filter(slot => slot.id !== action.payload.id),
                };
            }else {
                return {
                    ...state,
                    selectedSlots: [...state.selectedSlots, action.payload],
                };
            }
        }
        case "CLEAR_CART": 
            return {...state, selectedSlots: []};
        default:
            return state;
    }
}