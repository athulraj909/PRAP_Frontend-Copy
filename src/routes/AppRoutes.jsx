import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";

import Login from "../pages/auth/Login";
import Landing from "../pages/landing/Landing";
import StudentAssessment from "../pages/student/StudentAssessment";
import RegistrationSuccess from "../pages/student/RegistrationSuccess";
import StudentDashboard from "../pages/student/StudentDashboard";
import ExamInstructions from "../pages/student/ExamInstructions";
import StudentExam from "../pages/student/StudentExam";
import StudentExamResult from "../pages/student/StudentExamResult";
import StudentProfile from "../pages/student/StudentProfile";
import AssessmentHistory from "../pages/student/AssessmentHistory";
import StudentStatistics from "../pages/student/StudentStatistics";

import Dashboard from "../pages/dashboard/Dashboard";
import DistrictList from "../pages/masters/district/DistrictList";
import CollegeList from "../pages/masters/college/CollegeList";
import CollegeStudents from "../pages/masters/college/CollegeStudents";
import StudentPerformanceDetail from "../pages/masters/college/StudentPerformanceDetail";
import CourseList from "../pages/masters/course/CourseList";
import AssessmentCategoryList from "../pages/masters/assessment-category/AssessmentCategoryList";
import QuestionList from "../pages/questions/QuestionList";

import NotFound from "../pages/errors/NotFound";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Default - Landing Page */}

                <Route
                    path="/"
                    element={<Landing />}
                />

                {/* Admin Login - Only accessible via /admin */}

                <Route element={<PublicRoute />}>

                    <Route
                        path="/admin"
                        element={<Login />}
                    />

                    {/* Student Assessment - Public access */}

                    <Route
                        path="/student-assessment"
                        element={<StudentAssessment />}
                    />

                    <Route
                        path="/registration-success"
                        element={<RegistrationSuccess />}
                    />

                    <Route
                        path="/student-dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/exam-instructions"
                        element={<ExamInstructions />}
                    />

                    <Route
                        path="/student-exam"
                        element={<StudentExam />}
                    />

                    <Route
                        path="/student-exam-result"
                        element={<StudentExamResult />}
                    />

                    <Route
                        path="/student-profile"
                        element={<StudentProfile />}
                    />

                    <Route
                        path="/assessment-history"
                        element={<AssessmentHistory />}
                    />

                    <Route
                        path="/student-statistics"
                        element={<StudentStatistics />}
                    />

                </Route>

                {/* Protected */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<DashboardLayout />}>

                        {/* Dashboard */}

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        {/* ========================= */}
                        {/* Masters */}
                        {/* ========================= */}

                        <Route
                            path="/masters/districts"
                            element={<DistrictList />}
                        />

                        <Route
                            path="/masters/colleges"
                            element={<CollegeList />}
                        />

                        <Route
                            path="/masters/colleges/:collegeId/students"
                            element={<CollegeStudents />}
                        />

                        <Route
                            path="/masters/colleges/:collegeId/students/:studentMobile"
                            element={<StudentPerformanceDetail />}
                        />

                        <Route
                            path="/masters/courses"
                            element={<CourseList />}
                        />

                        <Route
                            path="/masters/assessment-categories"
                            element={<AssessmentCategoryList />}
                        />

                        {/* ========================= */}
                        {/* Students */}
                        {/* ========================= */}

                        <Route
                            path="/students"
                            element={<Dashboard />}
                        />

                        {/* ========================= */}
                        {/* Questions */}
                        {/* ========================= */}

                        <Route
                            path="/questions"
                            element={<QuestionList />}
                        />

                        {/* ========================= */}
                        {/* Assessment */}
                        {/* ========================= */}

                        <Route
                            path="/assessments"
                            element={<Dashboard />}
                        />

                        {/* ========================= */}
                        {/* Reports */}
                        {/* ========================= */}

                        <Route
                            path="/reports"
                            element={<Dashboard />}
                        />

                        {/* ========================= */}
                        {/* Settings */}
                        {/* ========================= */}

                        <Route
                            path="/settings"
                            element={<Dashboard />}
                        />

                    </Route>

                </Route>

                {/* 404 */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;