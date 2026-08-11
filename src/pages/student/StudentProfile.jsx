import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./StudentProfile.css";

function StudentProfile() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const session = localStorage.getItem("studentSession");
        if (session) {
            try {
                setStudent(JSON.parse(session));
            } catch (e) {
                console.error("Error parsing student session:", e);
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("studentSession");
        toast.info("Logged out successfully");
        navigate("/");
    };

    const handleBackToDashboard = () => {
        navigate("/student-dashboard");
    };

    if (!student) {
        return (
            <div className="student-profile-page">
                <div className="loading-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-profile-page">
            {/* Top Navigation Bar */}
            <header className="sp-navbar">
                <div className="sp-navbar-container">
                    <div className="sp-navbar-left">
                        <Link to="/student-dashboard" className="sp-logo">
                            <div className="sp-shield-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span className="sp-logo-text">PRAP</span>
                        </Link>

                        <nav className="sp-nav-links">
                            <Link to="/student-dashboard" className="sp-nav-link">
                                Dashboard
                            </Link>
                            <Link to="/student-dashboard" className="sp-nav-link">
                                Result
                            </Link>
                            <Link to="/student-profile" className="sp-nav-link active">
                                Profile
                            </Link>
                        </nav>
                    </div>

                    <div className="sp-navbar-right">
                        <div className="sp-user-info">
                            <span className="sp-user-name">{student.name}</span>
                            <span className="sp-user-detail">{student.course} — 2025</span>
                        </div>
                        <button onClick={handleLogout} className="sp-btn-logout">
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

            {/* Main Content */}
            <main className="sp-main-container">
                <button onClick={handleBackToDashboard} className="sp-btn-back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="sp-profile-header">
                    <div className="sp-profile-avatar">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="sp-profile-info">
                        <h1>{student.name}</h1>
                        <p>{student.course} Student · {student.college}</p>
                    </div>
                </div>

                <div className="sp-profile-content">
                    <div className="sp-section-card">
                        <h2>Personal Information</h2>
                        <div className="sp-details-grid">
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">Full Name</span>
                                <span className="sp-detail-value">{student.name}</span>
                            </div>
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">Email Address</span>
                                <span className="sp-detail-value">{student.email}</span>
                            </div>
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">Mobile Number</span>
                                <span className="sp-detail-value">{student.mobile}</span>
                            </div>
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">Registration Date</span>
                                <span className="sp-detail-value">
                                    {student.registeredAt ? new Date(student.registeredAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="sp-section-card">
                        <h2>Academic Information</h2>
                        <div className="sp-details-grid">
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">College/University</span>
                                <span className="sp-detail-value">{student.college}</span>
                            </div>
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">Course/Stream</span>
                                <span className="sp-detail-value">{student.course}</span>
                            </div>
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">District</span>
                                <span className="sp-detail-value">{student.district}</span>
                            </div>
                            <div className="sp-detail-item">
                                <span className="sp-detail-label">Year of Passing</span>
                                <span className="sp-detail-value">2025</span>
                            </div>
                        </div>
                    </div>

                    <div className="sp-section-card">
                        <h2>Account Status</h2>
                        <div className="sp-status-row">
                            <div className="sp-status-badge completed">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Registration Complete
                            </div>
                            <div className="sp-status-badge pending">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Assessment Pending
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudentProfile;
