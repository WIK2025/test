import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
    children: ReactNode;
}

interface State{
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component <Props, State>{
    public state: State = {
        hasError: false,
        error: null
    }
    public static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error}; // возвращаем состояние
    }
    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaight error:', error, errorInfo);
    }
      public handleReset = () => {
        localStorage.clear(); // очищаем локальное хранилище
        this.setState({hasError: false, error: null}); // ставим базовые настройки
        window.location.href = '/'; // обновляем страницу
      };
        public render(){
        if (this.state.hasError){
            return(
                <div>
                    <div>
                        <h2>Что то пошло не так</h2>
                        <p>Произошла непредвиденная ошибка</p>
                        <button onClick={this.handleReset} // через this т.к. находимся в классе
                        >
                            Вернуться на Главную
                        </button>
                    </div>
                </div>
            );
            return this.props.children;

        }
    }
}