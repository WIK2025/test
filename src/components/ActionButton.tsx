import React from "react";

interface ActionButtonProps{
    onAction: () => void;
    label: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({onAction, label})=>{
    return (
        <button
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm text-center"
            onClick={(e)=>{
                e.stopPropagation();
                onAction();
            }}
        >{label}</button>
    );
};