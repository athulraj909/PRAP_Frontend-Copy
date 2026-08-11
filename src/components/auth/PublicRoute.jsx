import { Navigate, Outlet, useLocation } from "react-router-dom";

function PublicRoute() {

    const isAdminAuthenticated = !!localStorage.getItem("token");
    const isStudentAuthenticated = !!localStorage.getItem("studentToken");
    const location = useLocation();

    // Student routes that should be accessible even when authenticated
    const studentRoutes = [
        "/student-assessment",
        "/registration-success",
        "/exam-instructions",
        "/student-exam",
        "/student-exam-result",
        "/student-profile",
        "/assessment-history",
        "/student-statistics"
    ];

    const isStudentRoute = studentRoutes.includes(location.pathname);

    // If admin is authenticated and not on student-assessment page, redirect to dashboard
    if (isAdminAuthenticated && location.pathname !== "/student-assessment") {
        return <Navigate to="/dashboard" replace />;
    }

    // If student is authenticated and on a student route, allow access
    if (isStudentAuthenticated && isStudentRoute) {
        return <Outlet />;
    }

    return <Outlet />;

}

export default PublicRoute;