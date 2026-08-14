import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/admin" replace />;

}

export default ProtectedRoute;