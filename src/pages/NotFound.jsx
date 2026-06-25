import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
            <h1 className="text-6xl font-bold text-violet-500">404</h1>
            <p className="text-xl text-center">Page not found</p>
            <p className="text-gray-500 text-center">The page you are looking for does not exist.</p>
            <Link to="/" className="px-4 py-2 bg-violet-500 text-white rounded-md font-semibold hover:bg-violet-600">
                Back to home
            </Link>
        </div>
    );
};

export default NotFound;
