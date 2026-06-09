import { createContext, useReducer } from 'react';

export const CVContext = createContext();

//  Начальное состояние 
const initialState = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    position: ''
  },
  experience: [
    { id: 1, company: '', role: '', years: '' }
  ],
  theme: 'classic'
};

// Редьюсер
function cvReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          [action.payload.key]: action.payload.value
        }
      };
      
    case 'ADD_EXPERIENCE':
  return {
    ...state, 
    experience: [ 
      ...state.experience, 
      { id: Date.now(), company: '', role: '', years: '' } 
    ]
  };

      
    case 'UPDATE_EXPERIENCE':
  return {
    ...state, 
    experience: state.experience.map(item => { 
      if (item.id === action.payload.id) { 
        return {
          ...item,
          [action.payload.key]: action.payload.value 
        };
      }
      return item; 
    })
  };

      
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
      
    default:
      return state;
  }
}


export function CVProvider({ children }) {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  return (
    <CVContext.Provider value={{ state, dispatch }}>
      {children}
    </CVContext.Provider>
  );
}
