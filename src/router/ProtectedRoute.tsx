import {Navigate, Outlet} from "react-router-dom";
import { useAppSelector} from "../app/hooks";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    // Đã xác thực, cho phép truy cập
    return <Outlet />;
};

export default ProtectedRoute;