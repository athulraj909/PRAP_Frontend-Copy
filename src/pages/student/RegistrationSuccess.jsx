import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

import "./RegistrationSuccess.css";

function RegistrationSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if student session exists
        const studentSession = localStorage.getItem("studentSession");
        if (!studentSession) {
            navigate("/student-assessment");
        }
    }, [navigate]);

    const handleBackToHome = () => {
        // Clear student session when going back to home
        localStorage.removeItem("studentSession");
        navigate("/");
    };

    const studentSession = JSON.parse(localStorage.getItem("studentSession") || "{}");

    return (
        <div className="registration-success-page">
            <div className="registration-success-container">
                <div className="success-icon">✓</div>
                
                <Card>
                    <div className="success-content">
                        <h1>Registration Successful!</h1>
                        <p className="success-message">
                            Thank you for registering with PRAP. Your details have been successfully saved.
                        </p>

                        <div className="student-details">
                            <h3>Your Registration Details</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">{studentSession.name || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{studentSession.email || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Mobile</span>
                                    <span className="detail-value">{studentSession.mobile || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">District</span>
                                    <span className="detail-value">{studentSession.district || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">College</span>
                                    <span className="detail-value">{studentSession.college || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Course</span>
                                    <span className="detail-value">{studentSession.course || "-"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="assessment-instructions">
                            <h3>Assessment Instructions</h3>
                            <ul className="steps-list">
                                <li>📝 The assessment consists of multiple sections</li>
                                <li>⏱️ Each section has a time limit</li>
                                <li>🎯 Questions test your aptitude, technical skills, and communication</li>
                                <li>📊 You will receive a detailed performance report</li>
                                <li>💡 Take the assessment in a quiet environment</li>
                                <li>🔒 Ensure stable internet connection during the assessment</li>
                                <li>📵 Do not switch tabs or windows during the assessment</li>
                            </ul>
                        </div>

                        <div className="next-steps">
                            <h3>What's Next?</h3>
                            <ul className="steps-list">
                                <li>📝 You will be notified when assessments are available</li>
                                <li>📊 Your assessment results will be available in your dashboard</li>
                                <li>🎯 Prepare for placement tests with our study materials</li>
                                <li>💡 Keep your profile updated for better opportunities</li>
                            </ul>
                        </div>

                        <div className="success-actions">
                            <Button 
                                size="lg" 
                                variant="primary"
                                onClick={handleBackToHome}
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default RegistrationSuccess;
