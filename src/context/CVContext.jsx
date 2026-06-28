import { createContext, useReducer, useEffect } from 'react';


export const CVContext = createContext();

// базовые значения ,если пользователь зашел первый раз 
const defaultState = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    position: ''
  },
  experience: [
    { id: 1, company: '', role: '', years: '' }
  ],
   education: [
    { id: 1, school: '', degree: '', year: '' }
  ],
  theme: 'classic'
};

//  считаем сохраненный текст из памяти браузера при первом старте
const getInitialState = () => {
  const savedData = localStorage.getItem('cv_data');

  return savedData ? JSON.parse(savedData) : defaultState;
};


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
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [
          ...state.education,
          { id: Date.now(), school: '', degree: '', year: '' }
        ]
      };
      
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(item => {
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
  
  const [state, dispatch] = useReducer(cvReducer, defaultState, getInitialState);

  
  useEffect(() => {
    localStorage.setItem('cv_data', JSON.stringify(state));
  }, [state]); 

  return (
    <CVContext.Provider value={{ state, dispatch }}>
      {children}
    </CVContext.Provider>
  );
}
