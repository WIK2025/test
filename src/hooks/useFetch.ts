import React, { useState, useEffect } from "react";

export function useFetch<T>(fetchFn: () => T[], dependencies: React.DependencyList = []){
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const timer = setTimeout(()=>{
            try {
                const result = fetchFn();
                    setData(result);
                    setLoading(false);
                    setError(null);
            }
            catch {
                    setError('Не удалось загрузить данные');
                    setLoading(false);
            }
        },800);

        return () => clearTimeout(timer);
    }, [fetchFn, dependencies]);
    
    return { data, loading, error };
}