import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../pages/others/commonReusableComponents/LoadingSpinner";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized, role } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (role === "user") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
