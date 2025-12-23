import {useAppSelector} from "../app/hooks.ts";
import {Navigate, Outlet} from "react-router-dom";

const PublicRoute = () => {
    const {isAuthenticated} = useAppSelector((state) => state.auth);
    if(isAuthenticated){
        return <Navigate to="/" replace/>
    }
    return <Outlet />;
};

export default PublicRoute;