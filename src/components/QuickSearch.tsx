import { useRef, useEffect } from "react";

interface QuickSearchProps {
    onSearchSubmit: (query: string) => void;
}

export const QuickSearch = ({ onSearchSubmit }: QuickSearchProps) => { 
    const inputRef = useRef<HTMLInputElement | null>(null);
    const debounceTimeRef = useRef<number | null>(null);

    useEffect(() => {
        // при монтировании фокусируемся на инпуте
        if (inputRef.current) { 
            inputRef.current.focus();
        }
        
        // при размонтировании очищаем таймер
        return () => {
            if (debounceTimeRef.current) {
                window.clearTimeout(debounceTimeRef.current);
            }
        };
    }, []);

    const handleInputChange = () => {
        if (!inputRef.current) return;
        const currentText = inputRef.current.value;

        // сброс  вызова
        if (debounceTimeRef.current) {
            window.clearTimeout(debounceTimeRef.current); 
        }

        //  таймер на 500мс
        debounceTimeRef.current = window.setTimeout(() => {
            onSearchSubmit(currentText);
        }, 500);
    };

    
    return (
        <div style={{
            marginBottom: '20px',
            backgroundColor: '#f3f4f6',
            padding: '12px',
            borderRadius: '6px'
        }}>
            <label htmlFor="search-input" style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500'
            }}>
                Мгновенный поиск по заказам
            </label>
            
 
            <input
                id="search-input"
                ref={inputRef}
                type="text"
                onChange={handleInputChange}
                placeholder="Введите адрес или номер заказа..."
                style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5d8',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                }}
            />
        </div>
    );
};
