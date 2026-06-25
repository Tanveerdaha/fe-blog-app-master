import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPrivateRoute = () => {

    const { user } = useSelector((state) => state.userSliceApp);

    if (user && user.isAdmin) {
        return <Outlet />;
    }

    if (user) {
        return <Navigate to="/dashboard?tab=profile" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default AdminPrivateRoute;
