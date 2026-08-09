import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { mockResources, Resource } from "../mockData/mockData";
import { BookingFilters } from "../components/BookingFilters";
import { ResourceCard } from "../components/ResourceCard";
import { SkeletonCard } from "../components/SkeletonCard";

export const Booking: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        search: '',
        date: new Date().toISOString().split('T')[0], 
        type: 'all' as 'all' | 'desk' | 'room',
        floor: 'all' as number | 'all',
        hasFlipchart: false,
        hasTypeC: false
    });

    const { data: resources, loading, error } = useFetch<Resource[]>(
        () => mockResources,
        [filters.date, filters.type]
    );

    const filteredResources = useMemo(() => {
        if (!resources || !Array.isArray(resources)) return [];
        return resources.filter(res => {
            if (!res || !res.name) return false;
            
            const matchesSearch = res.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.type === 'all' || res.type === filters.type;
            const matchesFloor = filters.floor === 'all' || res.floor === filters.floor;
            
            // проверка наличия массива характеристик features
            const features = res.features || [];
            const matchesFlipchart = !filters.hasFlipchart || features.includes('Флипчарт');
            const matchesTypeC = !filters.hasTypeC || features.includes('Type-C монитор');
            
            return matchesSearch && matchesType && matchesFloor && matchesFlipchart && matchesTypeC;
        });
    }, [resources, filters]);

    const handleSelectResource = (id: string) => {
        if (id) {
            navigate(`/resource/${id}`);
        }
    };

    const [shouldCrash, setShouldCrash] = useState(false);
    if (shouldCrash) {
        throw new Error('Симуляция сбоя');
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/*  Заголовок */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Рабочее пространство</h1>
                    <p className="text-sm text-gray-400 mt-1">Используйте фильтры для быстрого поиска и бронирования шеринг-зон офиса.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => setShouldCrash(true)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
                >
                    Тест сбоя
                </button>
            </div>
            
            <BookingFilters filters={filters} setFilters={setFilters} />
            
            {error && <div className="text-red-500 my-4 p-3 bg-red-50 rounded-xl border border-red-100 text-sm font-medium">{error}</div>}
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Найдено доступных ресурсов: {filteredResources.length}</div>
                    
                    {filteredResources.length === 0 ? (
                        /*  заглушка ничего не найдено */
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                            <p className="text-sm text-gray-400 font-medium">
                                По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredResources.map(resource => (
                                <ResourceCard 
                                    key={resource?.id || Math.random().toString()}
                                    resource={resource}
                                    onSelectResource={handleSelectResource}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
