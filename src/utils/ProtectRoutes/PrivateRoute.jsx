import Cookies from 'js-cookie';
import {Navigate} from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({allowedRole, redirectTo, children})=> {
    // const accessToken = Cookies.get(`${allowedRole}_access_token`);
    const accessToken = Cookies.get(`access_token`);
  
    if (!accessToken) {
        return <Navigate to={redirectTo} replace />;
    }

    try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 < Date.now()) {
            return <Navigate to={redirectTo} replace />;
        }
        
        const userRole = decoded?.role;
        const isAuthorized = allowedRole === userRole;
        
        if(!isAuthorized) {
            return <Navigate to={redirectTo} replace />
        }
        
        return children;
        
    } catch(err) {
        console.error("Token decoding error:", err);
        return <Navigate to={redirectTo} replace />;
    }
}
export default PrivateRoute;