import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./AssessmentNotice.css";

function AssessmentNotice() {
    const navigate = useNavigate();
    const [studentSession, setStudentSession] = useState(null);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("studentSession");
        if (session) {
            try {
                setStudentSession(JSON.parse(session));
            } catch (e) {
                console.error("Error loading session", e);
            }
        } else {
            // Default demo student if no session
            setStudentSession({
                name: "aaa",
                email: "aaa@example.com",
                mobile: "7894561235",
                college: "RVS College",
                course: "BCA"
            });
        }
    }, []);

    const handleStartExam = () => {
        if (!agreed) {
            toast.warning("Please agree to the assessment instructions before starting.");
            return;
        }
        toast.success("Starting Assessment! Good luck.");
        // Redirect to assessment test environment when built
        navigate("/assessment-test");
    };

    return (
        <div className="notice-page">
            {/* Top Navbar */}
            <header className="notice-navbar">
                <div className="notice-nav-container">
                    <Link to="/student-dashboard" className="notice-logo">
                        <div className="logo-icon">
                            <img src="/assets/logo-final.svg" alt="PRAP Logo" />
                        </div>
                        <div className="logo-text">
                            <span className="logo-title">PRAP</span>
                            <span className="logo-subtitle">Assessment Portal</span>
                        </div>
                    </Link>
                    <Link to="/student-dashboard" className="btn-back-dash">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="notice-main">
                <div className="notice-card">
                    {/* Header Banner */}
                    <div className="notice-header">
                        <span className="notice-badge">IMPORTANT NOTICE</span>
                        <h1>Assessment Instructions & Guidelines</h1>
                        <p>Please read all the instructions carefully before launching your examination.</p>
                    </div>

                    {/* Student Info Bar */}
                    {studentSession && (
                        <div className="notice-student-bar">
                            <div className="info-chip">
                                <span className="chip-label">Candidate:</span>
                                <span className="chip-value">{studentSession.name}</span>
                            </div>
                            <div className="info-chip">
                                <span className="chip-label">Mobile:</span>
                                <span className="chip-value">{studentSession.mobile}</span>
                            </div>
                            <div className="info-chip">
                                <span className="chip-label">College:</span>
                                <span className="chip-value">{studentSession.college || "RVS College"}</span>
                            </div>
                            <div className="info-chip">
                                <span className="chip-label">Course:</span>
                                <span className="chip-value">{studentSession.course || "BCA"}</span>
                            </div>
                        </div>
                    )}

                    {/* Instruction Highlights Grid */}
                    <div className="notice-highlights-grid">
                        <div className="highlight-box">
                            <div className="box-icon">⏱️</div>
                            <div className="box-content">
                                <h4>100 Minutes</h4>
                                <p>Total duration for completion</p>
                            </div>
                        </div>

                        <div className="highlight-box">
                            <div className="box-icon">📝</div>
                            <div className="box-content">
                                <h4>100 Questions</h4>
                                <p>Multiple choice questions</p>
                            </div>
                        </div>

                        <div className="highlight-box">
                            <div className="box-icon">🎯</div>
                            <div className="box-content">
                                <h4>1 Mark Each</h4>
                                <p>Total 100 marks maximum</p>
                            </div>
                        </div>

                        <div className="highlight-box">
                            <div className="box-icon">✅</div>
                            <div className="box-content">
                                <h4>No Negative Marks</h4>
                                <p>No penalty for wrong answers</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Rules List */}
                    <div className="notice-section">
                        <h3>Examination Guidelines</h3>
                        <ul className="rules-list">
                            <li>
                                <span className="rule-bullet">1</span>
                                <div>
                                    <strong>Question Format:</strong> All 100 questions are Multiple Choice Questions (MCQ). Select exactly <strong>one option</strong> per question.
                                </div>
                            </li>
                            <li>
                                <span className="rule-bullet">2</span>
                                <div>
                                    <strong>Time Management:</strong> The timer will start immediately after clicking <em>"Start Exam"</em>. The assessment will auto-submit when the 100-minute timer expires.
                                </div>
                            </li>
                            <li>
                                <span className="rule-bullet">3</span>
                                <div>
                                    <strong>Navigation & Submission:</strong> You can navigate between questions during the assessment. Ensure you click <em>"Submit Exam"</em> before closing.
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Proctored Warning Alert Box */}
                    <div className="proctor-warning-card">
                        <div className="warning-header">
                            <span className="warning-icon">⚠️</span>
                            <h4>STRICT PROCTORING & TAB SWITCH RULE</h4>
                        </div>
                        <div className="warning-body">
                            <p>
                                <strong>Do not change screen or switch browser tabs.</strong>
                            </p>
                            <p>
                                The examination environment strictly monitors tab changes and window minimization. 
                                If you switch screen or tab <strong>3 times</strong>, your exam will be 
                                <span className="highlight-danger"> AUTOMATICALLY SUBMITTED</span> immediately and you will <strong>NOT be allowed to continue or resume</strong> the assessment.
                            </p>
                        </div>
                    </div>

                    {/* Agreement Declaration & Actions */}
                    <div className="notice-declaration-box">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            <span className="declaration-text">
                                I have read, understood, and agree to follow all the assessment rules, time limits, and strict tab-switching proctoring policies.
                            </span>
                        </label>

                        <div className="notice-actions">
                            <button
                                onClick={handleStartExam}
                                disabled={!agreed}
                                className={`btn-proceed-exam ${agreed ? "active" : "disabled"}`}
                            >
                                Start Assessment Now →
                            </button>
                            <button
                                onClick={() => navigate("/student-dashboard")}
                                className="btn-cancel-notice"
                            >
                                Cancel & Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AssessmentNotice;
