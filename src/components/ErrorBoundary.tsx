import type { ErrorInfo, ReactNode } from "react";
import { Component } from 'react';

interface Props{
    children: ReactNode;
}

interface State{
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State>{
    public state: State = {
        hasError: false,
        error: null
    }
    public static getDerivedStateFromError(error:Error): State{
        return {hasError: true, error};
    }
    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error:', error, errorInfo);
    }
    public handleReset = () => {
        localStorage.clear();
        this.setState({hasError: false, error: null});
        window.location.href = '/';
    };

    public render(){
                if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                        {/* красный заголовок */}
                        <h2 className="text-xl font-bold text-red-600 mb-2">
                            Что-то пошло не так
                        </h2>
                        {/* описание ошибки  */}
                        <p className="text-xs text-gray-500 leading-relaxed mb-6">
                            Произошла непредвиденная ошибка в приложении.<br />
                            Возможно, были переданы некорректные данные.
                        </p>

                        {/* кнопка сброса */}
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.clear(); // очищаем некорректные данные
                                window.location.href = '/'; // возвращаемся на главную
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm text-center shadow-sm"
                        >
                            Сбросить кэш и вернуться на Главную
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;

    }
}
