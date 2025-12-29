import {Navigate, Outlet} from "react-router-dom";
import {useAppSelector} from "../app/hooks";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;