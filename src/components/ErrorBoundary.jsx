import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
                    <h1 className="text-2xl font-semibold">Something went wrong</h1>
                    <p className="text-gray-500 text-center">An unexpected error occurred. Please try again.</p>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Go to home
                    </Link>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
