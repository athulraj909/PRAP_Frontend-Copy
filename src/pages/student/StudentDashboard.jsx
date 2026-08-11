import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import "./StudentDashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [assessmentCount, setAssessmentCount] = useState(0);

    useEffect(() => {
        const session = localStorage.getItem("studentSession");
        if (session) {
            try {
                setStudent(JSON.parse(session));
                loadAssessmentCount(JSON.parse(session).mobile);
            } catch (e) {
                console.error("Error parsing student session:", e);
            }
        }
    }, []);

    const loadAssessmentCount = async (mobile) => {
        try {
            const { getAssessmentHistory } = await import("../../services/assessmentHistoryService");
            const history = await getAssessmentHistory(mobile);
            setAssessmentCount(history.length);
        } catch (error) {
            console.error("Failed to load assessment count:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("studentSession");
        toast.info("Logged out successfully");
        navigate("/");
    };

    const handleStartAssessment = () => {
        navigate("/exam-instructions");
    };

    const studentName = student?.name || "Priya Sharma";
    const studentCourse = student?.course || "BCA";
    const studentCollege = student?.college || "RVS College";

    return (
        <div className="student-dashboard-page">
            {/* Top Navigation Bar */}
            <header className="sd-navbar">
                <div className="sd-navbar-container">
                    <div className="sd-navbar-left">
                        <Link to="/" className="sd-logo">
                            <div className="sd-shield-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span className="sd-logo-text">PRAP</span>
                        </Link>

                        <nav className="sd-nav-links">
                            <Link to="/student-dashboard" className="sd-nav-link">
                                Dashboard
                            </Link>
                            <Link to="/assessment-history" className="sd-nav-link">
                                Assessment History
                            </Link>
                            <Link to="/student-profile" className="sd-nav-link">
                                Profile
                            </Link>
                        </nav>
                    </div>

                    <div className="sd-navbar-right">
                        <div className="sd-user-info">
                            <span className="sd-user-name">{studentName}</span>
                            <span className="sd-user-detail">{studentCourse} — 2025</span>
                        </div>
                        <button onClick={handleLogout} className="sd-btn-logout">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="sd-main-container">
                {/* Welcome Card Banner */}
                <div className="sd-welcome-card">
                    <div className="sd-welcome-icon-box">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <div className="sd-welcome-text">
                        <h2>Welcome, {studentName}!</h2>
                        <p>{studentCourse} · {studentCollege} · 2025 Pass-out</p>
                    </div>
                </div>

                {/* Start Assessment Section */}
                <div className="sd-assessment-section">
                    <div className="sd-assessment-card">
                        <div className="sd-assessment-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <div className="sd-assessment-content">
                            <h3>Ready to take the assessment?</h3>
                            <p>Start your placement assessment now. The exam consists of 100 questions to be completed in 5 minutes.</p>
                            <button onClick={handleStartAssessment} className="sd-btn-primary">
                                Start Assessment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Cards Grid */}
                <div className="sd-status-grid">
                    <div className="sd-status-card">
                        <div className="sd-status-icon-circle green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span className="sd-status-title">Registration</span>
                        <span className="sd-status-value completed">Completed</span>
                    </div>

                    <div className="sd-status-card">
                        <div className="sd-status-icon-circle orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <span className="sd-status-title">Assessments Taken</span>
                        <span className="sd-status-value pending">{assessmentCount}</span>
                    </div>

                    <div 
                        className="sd-status-card clickable"
                        onClick={() => navigate("/assessment-history")}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="sd-status-icon-circle gray">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="7" />
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                            </svg>
                        </div>
                        <span className="sd-status-title">Result</span>
                        <span className="sd-status-value unavailable">View Results</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;
