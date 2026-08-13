import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

import assessmentHistoryService from "../../../services/assessmentHistoryService";

import "./StudentPerformanceDetail.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

function StudentPerformanceDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentMobile: urlStudentMobile } = useParams();
    
    const student = location.state?.student || {};
    const collegeName = location.state?.collegeName || "";
    const studentMobile = urlStudentMobile || location.state?.student?.mobile || "";
    
    const [assessmentHistory, setAssessmentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartFilter, setChartFilter] = useState(10);
    const [overallStats, setOverallStats] = useState({
        totalAssessments: 0,
        totalScore: 0,
        totalPossible: 0,
        avgPercentage: 0,
        passedCount: 0,
        failedCount: 0,
    });
    const [categoryStats, setCategoryStats] = useState([]);

    useEffect(() => {
        if (!studentMobile) {
            navigate("/masters/colleges");
            return;
        }
        loadAssessmentHistory();
    }, [studentMobile, navigate]);

    const loadAssessmentHistory = async () => {
        try {
            setLoading(true);
            const history = await assessmentHistoryService.getAssessmentHistory(studentMobile);
            setAssessmentHistory(history);
            calculateOverallStats(history);
            calculateCategoryStats(history);
        } catch (error) {
            console.error("Failed to load assessment history:", error);
            toast.error("Failed to load assessment history");
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallStats = (history) => {
        if (history.length === 0) {
            setOverallStats({
                totalAssessments: 0,
                totalScore: 0,
                totalPossible: 0,
                avgPercentage: 0,
                passedCount: 0,
                failedCount: 0,
            });
            return;
        }

        const totalScore = history.reduce((sum, record) => sum + record.totalScore, 0);
        const totalPossible = history.reduce((sum, record) => sum + record.totalQuestions, 0);
        const avgPercentage = Math.round((totalScore / totalPossible) * 100);
        const passedCount = history.filter(record => record.percentage >= 50).length;
        const failedCount = history.length - passedCount;

        setOverallStats({
            totalAssessments: history.length,
            totalScore,
            totalPossible,
            avgPercentage,
            passedCount,
            failedCount,
        });
    };

    const calculateCategoryStats = (history) => {
        const categoryMap = {};

        history.forEach(record => {
            record.categoryPerformance.forEach(cat => {
                if (!categoryMap[cat.category]) {
                    categoryMap[cat.category] = {
                        category: cat.category,
                        totalCorrect: 0,
                        totalQuestions: 0,
                    };
                }
                categoryMap[cat.category].totalCorrect += cat.correct;
                categoryMap[cat.category].totalQuestions += cat.total;
            });
        });

        const categories = Object.values(categoryMap).map(cat => ({
            ...cat,
            percentage: Math.round((cat.totalCorrect / cat.totalQuestions) * 100),
        }));

        setCategoryStats(categories);
    };

    const handleBack = () => {
        // Check if we came from college students or general students
        const fromCollege = location.state?.fromCollege;
        
        if (fromCollege && collegeName) {
            navigate(`/masters/colleges/${collegeName}/students`, { state: { collegeName } });
        } else {
            navigate("/students");
        }
    };

    // Chart data configurations
    const pieChartData = {
        labels: ["Passed", "Failed"],
        datasets: [
            {
                data: [overallStats.passedCount, overallStats.failedCount],
                backgroundColor: ["#10b981", "#ef4444"],
                borderColor: ["#059669", "#dc2626"],
                borderWidth: 2,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
    };

    const barChartData = {
        labels: categoryStats.map(cat => cat.category),
        datasets: [
            {
                label: "Percentage",
                data: categoryStats.map(cat => cat.percentage),
                backgroundColor: "#168d8d",
                borderColor: "#0d6e6e",
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const lineChartData = {
        labels: assessmentHistory.slice(-chartFilter).map((_, index) => {
            const actualIndex = assessmentHistory.length - chartFilter + index + 1;
            return `Assessment ${actualIndex}`;
        }),
        datasets: [
            {
                label: "Score Percentage",
                data: assessmentHistory.slice(-chartFilter).map(record => record.percentage),
                borderColor: "#168d8d",
                backgroundColor: "rgba(22, 141, 141, 0.1)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
    };

    if (loading) {
        return (
            <div className="student-performance-page">
                <div className="loading-state">
                    <p>Loading performance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-performance-page">
            <div className="page-container">
                <div className="page-header">
                    <Button size="sm" onClick={handleBack}>
                        ← Back to Students
                    </Button>
                    <h1>Student Performance - {student.name}</h1>
                    <div></div>
                </div>

                {assessmentHistory.length === 0 ? (
                    <Card>
                        <div className="empty-state">
                            <p>No assessment data available for this student.</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Student Info Card */}
                        <Card className="student-info-card">
                            <div className="student-info-grid">
                                <div className="info-item">
                                    <span className="label">Name</span>
                                    <span className="value">{student.name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Email</span>
                                    <span className="value">{student.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Mobile</span>
                                    <span className="value">{student.mobile}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">College</span>
                                    <span className="value">{student.college}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Course</span>
                                    <span className="value">{student.course}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">District</span>
                                    <span className="value">{student.district}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Overall Statistics */}
                        <div className="stats-grid">
                            <Card className="stat-card">
                                <span className="stat-label">Total Assessments</span>
                                <span className="stat-value">{overallStats.totalAssessments}</span>
                            </Card>
                            <Card className="stat-card">
                                <span className="stat-label">Average Percentage</span>
                                <span className="stat-value">{overallStats.avgPercentage}%</span>
                            </Card>
                            <Card className="stat-card">
                                <span className="stat-label">Passed</span>
                                <span className="stat-value success">{overallStats.passedCount}</span>
                            </Card>
                            <Card className="stat-card">
                                <span className="stat-label">Failed</span>
                                <span className="stat-value danger">{overallStats.failedCount}</span>
                            </Card>
                        </div>

                        {/* Charts Grid */}
                        <div className="charts-grid">
                            {/* Pie Chart - Pass/Fail */}
                            <Card className="chart-card">
                                <h3>Pass/Fail Distribution</h3>
                                <div className="chart-container">
                                    <Doughnut data={pieChartData} options={pieChartOptions} />
                                </div>
                            </Card>

                            {/* Bar Chart - Category Performance */}
                            <Card className="chart-card">
                                <h3>Category-wise Performance</h3>
                                <div className="chart-container">
                                    <Bar data={barChartData} options={barChartOptions} />
                                </div>
                            </Card>

                            {/* Line Chart - Performance Trend */}
                            <Card className="chart-card full-width">
                                <div className="chart-header">
                                    <h3>Performance Trend Over Assessments</h3>
                                    <div className="chart-filter">
                                        <label>Show last:</label>
                                        <select 
                                            value={chartFilter} 
                                            onChange={(e) => setChartFilter(Number(e.target.value))}
                                            className="filter-select"
                                        >
                                            <option value={5}>5 assessments</option>
                                            <option value={10}>10 assessments</option>
                                            <option value={20}>20 assessments</option>
                                            <option value={50}>50 assessments</option>
                                            <option value={assessmentHistory.length}>All ({assessmentHistory.length})</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    <Line data={lineChartData} options={lineChartOptions} />
                                </div>
                            </Card>
                        </div>

                        {/* Assessment History Table */}
                        <Card className="history-card">
                            <h3>Assessment History</h3>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Total Marks</th>
                                        <th>Percentage</th>
                                        <th>Time Taken</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessmentHistory.map((record, index) => (
                                        <tr key={index}>
                                            <td>{new Date(record.submittedAt).toLocaleDateString()}</td>
                                            <td>{record.totalScore}</td>
                                            <td>
                                                <span className={`percentage-badge ${record.percentage >= 50 ? "pass" : "fail"}`}>
                                                    {record.percentage}%
                                                </span>
                                            </td>
                                            <td>{Math.floor(record.timeTaken / 60)}m {record.timeTaken % 60}s</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentPerformanceDetail;
