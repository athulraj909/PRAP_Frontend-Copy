import { Navigate, Outlet, useLocation } from "react-router-dom";

function PublicRoute() {
    const isAdminAuthenticated = !!localStorage.getItem("token");
    const isStudentAuthenticated = !!(
        localStorage.getItem("studentToken") || localStorage.getItem("studentSession")
    );
    const location = useLocation();

    // If admin is authenticated and not on student-assessment page, redirect to admin dashboard
    if (isAdminAuthenticated && location.pathname !== "/student-assessment") {
        return <Navigate to="/dashboard" replace />;
    }

    // If student is authenticated and visiting root landing page, login page, or admin page, redirect to student dashboard
    const isPublicAuthPage =
        location.pathname === "/" ||
        location.pathname === "/student-assessment" ||
        location.pathname === "/admin";

    if (isStudentAuthenticated && isPublicAuthPage) {
        return <Navigate to="/student-dashboard" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;