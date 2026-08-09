export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border-gray-100 overflow-hidden flex flex-col h-full animation-pulse">
            <div className="h-40 bg-gray-200 w-full"></div>
        </div>
    );
};