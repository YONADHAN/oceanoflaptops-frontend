import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../pages/others/commonReusableComponents/LoadingSpinner';

const PrivateRoute = ({ allowedRole, redirectTo, children }) => {
    const { isAuthenticated, isInitialized, role } = useSelector((state) => state.auth);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRole !== role) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PrivateRoute;