import React from 'react';


interface GenericListProps<T> {
    items: T[]; 
    renderItem: (item: T) => React.ReactNode; 
    emptyPlaceholder: string; 
}


export const GenericList = <T,>({ items, renderItem, emptyPlaceholder }: GenericListProps<T>) => {
    
    
    if (items.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                {emptyPlaceholder}
            </div>
        );
    }

   
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
           
            {items.map((item, index) => (
                <div key={index}>
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
};
