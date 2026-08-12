import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

import "./ExamInstructions.css";

function ExamInstructions() {
    const navigate = useNavigate();
    const [studentSession, setStudentSession] = useState(null);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Get student session from localStorage
        const session = localStorage.getItem("studentSession");
        if (session) {
            setStudentSession(JSON.parse(session));
        } else {
            // No session, redirect to home
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        // Countdown timer before enabling start button
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleStartExam = () => {
        navigate("/student-exam");
    };

    const handleGoBack = () => {
        navigate("/student-dashboard");
    };

    if (!studentSession) {
        return (
            <div className="exam-instructions-page">
                <div className="loading-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="exam-instructions-page">
            <div className="exam-instructions-container">
                <div className="instructions-header">
                    <h1>Exam Instructions</h1>
                    <p>Please read the instructions carefully before starting the exam</p>
                </div>

                <div className="instructions-content">
                    <div className="student-info-card">
                        <h2>Student Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Name:</span>
                                <span className="value">{studentSession.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Mobile:</span>
                                <span className="value">{studentSession.mobile}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">College:</span>
                                <span className="value">{studentSession.college}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Course:</span>
                                <span className="value">{studentSession.course}</span>
                            </div>
                        </div>
                    </div>

                    <div className="exam-details-card">
                        <h2>Exam Details</h2>
                        <div className="exam-stats">
                            <div className="stat-item">
                                <div className="stat-icon">📝</div>
                                <div className="stat-content">
                                    <div className="stat-value">100</div>
                                    <div className="stat-label">Questions</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">⏱️</div>
                                <div className="stat-content">
                                    <div className="stat-value">100</div>
                                    <div className="stat-label">Minutes</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-content">
                                    <div className="stat-value">1</div>
                                    <div className="stat-label">Mark/Question</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">✅</div>
                                <div className="stat-content">
                                    <div className="stat-value">0</div>
                                    <div className="stat-label">Negative Marks</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="instructions-list-card">
                        <h2>Important Instructions</h2>
                        <ul className="instructions-list">
                            <li className="instruction-item">
                                <span className="instruction-number">1</span>
                                <span className="instruction-text">
                                    The exam consists of <strong>100 multiple-choice questions (MCQ)</strong>
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">2</span>
                                <span className="instruction-text">
                                    Total duration of the exam is <strong>100 minutes</strong>
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">3</span>
                                <span className="instruction-text">
                                    Each question carries <strong>1 mark</strong>. There are <strong>no negative marks</strong> for wrong answers
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">4</span>
                                <span className="instruction-text">
                                    Select <strong>only one option</strong> for each question
                                </span>
                            </li>
                            <li className="instruction-item warning">
                                <span className="instruction-number">⚠️</span>
                                <span className="instruction-text">
                                    <strong>Do not switch tabs or change screens</strong> during the exam
                                </span>
                            </li>
                            <li className="instruction-item warning">
                                <span className="instruction-number">⚠️</span>
                                <span className="instruction-text">
                                    If you change screen or tab <strong>3 times</strong>, your exam will be <strong>auto-submitted</strong> and you cannot continue
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">5</span>
                                <span className="instruction-text">
                                    Ensure you have a <strong>stable internet connection</strong> throughout the exam
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">6</span>
                                <span className="instruction-text">
                                    Take the exam in a <strong>quiet environment</strong> without distractions
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">7</span>
                                <span className="instruction-text">
                                    You can <strong>review and change answers</strong> before final submission
                                </span>
                            </li>
                            <li className="instruction-item">
                                <span className="instruction-number">8</span>
                                <span className="instruction-text">
                                    Click on <strong>"Submit Exam"</strong> when you have completed all questions
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="countdown-card">
                        <div className="countdown-content">
                            <div className="countdown-label">You can start the exam in</div>
                            <div className="countdown-timer">
                                {countdown > 0 ? (
                                    <span className="timer-value">{countdown}</span>
                                ) : (
                                    <span className="timer-value ready">Ready!</span>
                                )}
                                <span className="timer-unit">seconds</span>
                            </div>
                        </div>
                    </div>

                    <div className="instructions-actions">
                        <Button
                            type="button"
                            size="lg"
                            variant="primary"
                            onClick={handleStartExam}
                            disabled={countdown > 0}
                            className="start-exam-btn"
                        >
                            {countdown > 0 ? `Start Exam in ${countdown}s` : "Ready"}
                        </Button>

                        <Button
                            type="button"
                            size="lg"
                            variant="secondary"
                            onClick={handleGoBack}
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamInstructions;
