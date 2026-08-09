import React from "react";
import { Resource } from "../mockData/mockData";

interface ResourceCardProps {
    resource: Resource;
    onSelectResource: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelectResource }) => {
    return (
        <div
            onClick={() => {
                if (resource?.id) {
                    onSelectResource(resource.id);
                }
            }}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between h-64 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
            {/* верхняя часть*/}
            <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    resource.type === 'room' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-emerald-100 text-emerald-700'
                }`}>
                    {resource.type === 'room' ? 'Переговорная' : 'Рабочее место'}
                </span>
                
                {/* посередине  */}
                <div className="w-5 h-5 border-2 border-indigo-500/30 rounded flex items-center justify-center text-[10px] text-indigo-500 font-bold group-hover:border-indigo-500 transition-colors">
                    ⛶
                </div>
            </div>

            {/* название и этаж */}
            <div className="my-auto">
                <h3 className="text-base font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {resource.name}
                </h3>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">
                    {resource.floor} этаж
                </p>
            </div>

            {/* нижняя часть*/}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-50">
                {resource.features.map((feat, i) => (
                    <span 
                        key={i} 
                        className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md font-medium border border-gray-100/50"
                    >
                        {feat}
                    </span>
                ))}
            </div>
        </div>
    );
};
