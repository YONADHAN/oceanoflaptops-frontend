import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../pages/others/commonReusableComponents/LoadingSpinner';
import { savePendingReturnTo } from '../navigation/returnTo';

const PrivateRoute = ({ allowedRole, redirectTo, children }) => {
    const { isAuthenticated, isInitialized, role } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        savePendingReturnTo(location);
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRole !== role) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PrivateRoute;