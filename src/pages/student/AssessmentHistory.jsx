import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";

import "./AssessmentHistory.css";

function AssessmentHistory() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        const session = localStorage.getItem("studentSession");
        if (!session) {
            navigate("/");
            return;
        }

        const student = JSON.parse(session);
        loadHistory(student.mobile);
    }, [navigate]);

    useEffect(() => {
        if (fromDate || toDate) {
            filterHistoryByDate();
        } else {
            setFilteredHistory(history);
        }
    }, [fromDate, toDate, history]);

    const filterHistoryByDate = () => {
        let filtered = [...history];

        if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.submittedAt);
                return recordDate >= from;
            });
        }

        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.submittedAt);
                return recordDate <= to;
            });
        }

        setFilteredHistory(filtered);
    };

    const clearFilters = () => {
        setFromDate("");
        setToDate("");
        setFilteredHistory(history);
    };

    const loadHistory = async (mobile) => {
        try {
            const { getAssessmentHistory } = await import("../../services/assessmentHistoryService");
            const data = await getAssessmentHistory(mobile);
            const sortedData = data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
            setHistory(sortedData);
            setFilteredHistory(sortedData);
        } catch (error) {
            console.error("Failed to load assessment history:", error);
            toast.error("Unable to load assessment history.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTimeTaken = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="assessment-history-page">
                <div className="history-loading">
                    <p>Loading assessment history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="assessment-history-page">
            <div className="history-container">
                <div className="history-header">
                    <h1>Assessment History</h1>
                    <div className="header-actions">
                        {history.length > 0 && (
                            <Button
                                variant="primary"
                                onClick={() => navigate("/student-statistics")}
                            >
                                View Statistics
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/student-dashboard")}
                        >
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>

                <div className="history-filters">
                    <div className="filter-group">
                        <label>From Date:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label>To Date:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={clearFilters}
                        disabled={!fromDate && !toDate}
                    >
                        Clear Filters
                    </Button>
                </div>

                {filteredHistory.length === 0 && history.length > 0 ? (
                    <div className="history-empty">
                        <div className="empty-icon">🔍</div>
                        <h2>No Assessments Found</h2>
                        <p>No assessments match your selected date range. Try adjusting your filters.</p>
                        <Button onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                ) : history.length === 0 ? (
                    <div className="history-empty">
                        <div className="empty-icon">📊</div>
                        <h2>No Assessments Yet</h2>
                        <p>You haven't taken any assessments yet. Start your first assessment to see your history here.</p>
                        <Button onClick={() => navigate("/student-exam")}>
                            Take Assessment
                        </Button>
                    </div>
                ) : (
                    <div className="history-list">
                        {filteredHistory.map((record) => (
                            <div key={record.id} className="history-card">
                                <div className="history-card-header">
                                    <div className="history-date">
                                        <span className="date">{formatDate(record.submittedAt)}</span>
                                        <span className="time">{formatTime(record.submittedAt)}</span>
                                    </div>
                                    <div className="history-score-badge">
                                        <span className="score">{record.percentage}%</span>
                                    </div>
                                </div>

                                <div className="history-summary">
                                    <div className="summary-item">
                                        <span className="label">Total Score</span>
                                        <span className="value">{record.totalScore}/{record.totalQuestions}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">Time Taken</span>
                                        <span className="value">{formatTimeTaken(record.timeTaken)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">College</span>
                                        <span className="value">{record.college || "N/A"}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">Course</span>
                                        <span className="value">{record.course || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="history-categories">
                                    <h3>Category Performance</h3>
                                    <div className="category-list">
                                        {record.categoryPerformance.map((cat, index) => (
                                            <div key={index} className="category-item">
                                                <div className="category-info">
                                                    <span className="category-name">{cat.category}</span>
                                                    <span className="category-score">{cat.correct}/{cat.total}</span>
                                                </div>
                                                <div className="category-bar">
                                                    <div
                                                        className="category-fill"
                                                        style={{ width: `${cat.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="category-percent">{cat.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AssessmentHistory;
