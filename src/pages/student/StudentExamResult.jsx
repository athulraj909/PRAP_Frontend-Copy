import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import jsPDF from "jspdf";

import "./StudentExamResult.css";
import "./StudentDashboard.css";

function StudentExamResult() {
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const session = localStorage.getItem("studentSession");
        if (!session) {
            navigate("/");
            return;
        }

        const studentData = JSON.parse(session);
        setStudent(studentData);

        const resultData = localStorage.getItem(`examResult_${studentData.mobile}`);
        if (!resultData) {
            navigate("/student-dashboard");
            return;
        }

        setResult(JSON.parse(resultData));
    }, [navigate]);

    const downloadPDF = () => {
        if (!result || !student) return;

        const doc = new jsPDF();
        let yPosition = 20;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(22, 141, 141);
        doc.text("PRAP Assessment Result", 105, yPosition, { align: "center" });
        yPosition += 15;

        // Student Information
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Student Information", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.text(`Name: ${student.name}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Email: ${student.email}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Mobile: ${student.mobile}`, 20, yPosition);
        yPosition += 7;
        doc.text(`College: ${student.college}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Course: ${student.course}`, 20, yPosition);
        yPosition += 15;

        // Overall Score
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Overall Performance", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.text(`Score: ${result.score}/${result.totalQuestions}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Percentage: ${result.percentage}%`, 20, yPosition);
        yPosition += 7;
        doc.text(`Time Taken: ${Math.floor(result.timeTaken / 60)} min ${result.timeTaken % 60} sec`, 20, yPosition);
        yPosition += 7;
        doc.text(`Status: ${result.percentage >= 50 ? "PASS" : "FAIL"}`, 20, yPosition);
        yPosition += 15;

        // Category Performance
        doc.setFontSize(12);
        doc.text("Category-wise Performance", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        result.categoryPerformance.forEach((cat) => {
            doc.text(`${cat.category}: ${cat.correct}/${cat.total} (${cat.percentage}%)`, 20, yPosition);
            yPosition += 7;
        });
        yPosition += 10;

        // Questions and Answers
        doc.setFontSize(12);
        doc.text("Question Review", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        result.review.forEach((item, index) => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(`Q${index + 1}: ${item.question}`, 20, yPosition);
            yPosition += 8;

            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            Object.entries(item.options).forEach(([key, label]) => {
                const isSelected = key === item.selectedKey;
                const isCorrect = key === item.correctKey;
                let prefix = "  ";
                if (isCorrect) prefix = "✓ ";
                if (isSelected && !isCorrect) prefix = "✗ ";
                
                doc.text(`${prefix}${key.replace("option", "")}. ${label}`, 25, yPosition);
                yPosition += 6;
            });

            doc.setTextColor(0, 0, 0);
            doc.text(`Your Answer: ${item.selectedLabel || "No answer"}`, 25, yPosition);
            yPosition += 6;
            doc.text(`Correct Answer: ${item.correctLabel}`, 25, yPosition);
            yPosition += 6;
            doc.text(`Status: ${item.isCorrect ? "Correct" : "Incorrect"}`, 25, yPosition);
            yPosition += 10;

            if (item.explanation) {
                doc.setFontSize(9);
                doc.setTextColor(80, 80, 80);
                doc.text(`Explanation: ${item.explanation}`, 25, yPosition);
                yPosition += 10;
            }

            yPosition += 5;
        });

        // Save the PDF
        doc.save(`PRAP_Result_${student.name.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (!result) {
        return (
            <div className="exam-result-page">
                <div className="exam-result-loading">
                    <p>Loading your result...</p>
                </div>
            </div>
        );
    }

    const { score, totalQuestions, percentage, answeredCount, submittedAt, reason, timeTaken, categoryPerformance, review = [] } = result;

    return (
        <div className="exam-result-page">
            {/* Top Navigation Bar */}
            <header className="sd-navbar">
                <div className="sd-navbar-container">
                    <div className="sd-navbar-left">
                        <div className="sd-logo">
                            <div className="sd-shield-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span className="sd-logo-text">PRAP</span>
                        </div>

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
                </div>
            </header>

            <div className="exam-result-card">
                <div className="result-hero">
                    <div className="result-score-badge">
                        <span>{percentage}%</span>
                    </div>
                    <div className="result-hero-content">
                        <h1>Assessment Result</h1>
                        <p>Campus Placement Drive 2025</p>
                        <div className="result-status">
                            <span className={percentage >= 50 ? "status-pass" : "status-fail"}>
                                {percentage >= 50 ? "PASS" : "FAIL"}
                            </span>
                            <strong>{score}/{totalQuestions} marks</strong>
                        </div>
                    </div>
                    <button className="download-pdf-btn" type="button" onClick={downloadPDF}>
                        Download PDF
                    </button>
                </div>

                <div className="result-summary">
                    <div>
                        <span>Total Score</span>
                        <strong>{score}/{totalQuestions}</strong>
                    </div>
                    <div>
                        <span>Percentage</span>
                        <strong>{percentage}%</strong>
                    </div>
                    <div>
                        <span>Time Taken</span>
                        <strong>{Math.floor(timeTaken / 60)} min {timeTaken % 60} sec</strong>
                    </div>
                </div>

                <div className="result-details-card">
                    <h2>Category-wise Performance</h2>
                    <div className="category-grid">
                        {categoryPerformance.map((category) => (
                            <div key={category.category} className="category-row">
                                <div className="category-label">
                                    <span>{category.category}</span>
                                    <strong>{category.correct}/{category.total}</strong>
                                </div>
                                <div className="category-progress-bar">
                                    <div
                                        className="category-progress-fill"
                                        style={{ width: `${category.percentage}%` }}
                                    />
                                </div>
                                <span className="category-percent">{category.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="result-details-card review-section">
                    <h2>Question Review</h2>
                    <div className="review-grid">
                        {review.map((item, index) => (
                            <div key={item.id} className="review-card">
                                <div className="review-header">
                                    <span>Q{index + 1}</span>
                                    <span className={`review-chip ${item.isCorrect ? "correct" : "incorrect"}`}>
                                        {item.isCorrect ? "Correct" : "Incorrect"}
                                    </span>
                                </div>
                                <h3>{item.question}</h3>
                                <div className="review-options">
                                    {Object.entries(item.options).map(([key, label]) => {
                                        const isSelected = key === item.selectedKey;
                                        const isCorrect = key === item.correctKey;
                                        return (
                                            <div
                                                key={key}
                                                className={`option-row ${isCorrect ? "option-correct" : ""} ${isSelected ? "option-selected" : ""}`}
                                            >
                                                <span className="option-key">{key.replace("option", "")}</span>
                                                <span className="option-text">{label}</span>
                                                {isCorrect && <span className="option-label">Correct</span>}
                                                {isSelected && !isCorrect && <span className="option-label">Your answer</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="review-summary">
                                    <div><strong>Your answer:</strong> {item.selectedLabel || "No answer"}</div>
                                    <div><strong>Correct answer:</strong> {item.correctLabel}</div>
                                </div>
                                <div className="review-explanation">
                                    <strong>Explanation:</strong>
                                    <p>{item.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="result-actions">
                    <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/student-dashboard')}>
                        Back to Dashboard
                    </Button>
                    <Button type="button" variant="primary" onClick={() => navigate('/student-exam')}>
                        Start New Exam
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default StudentExamResult;
