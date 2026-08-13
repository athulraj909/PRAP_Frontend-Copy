import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import dashboardService from "../../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {
    const [stats, setStats] = useState({
        total_students: 0,
        total_assessments: 0,
        total_colleges: 0,
        hireability_score: "0%"
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, activityData] = await Promise.all([
                dashboardService.getDashboardStats(),
                dashboardService.getRecentActivity()
            ]);
            setStats(statsData);
            setRecentActivity(activityData);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const statistics = [
        {
            title: "Total Students",
            value: stats.total_students.toLocaleString(),
        },
        {
            title: "Assessments",
            value: stats.total_assessments.toLocaleString(),
        },
        {
            title: "Colleges",
            value: stats.total_colleges.toLocaleString(),
        },
        {
            title: "Hireability Score",
            value: stats.hireability_score,
        },
    ];

    return (
        <div className="page-container">

            <div className="page-title">
                <h2>Dashboard</h2>
                <p>
                    Welcome to the Placement Readiness Assessment Platform.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading dashboard data...</p>
                </div>
            ) : (
                <>
                    <div className="dashboard-grid">

                        {statistics.map((item) => (
                            <Card key={item.title}>

                                <div className="stat-card">

                                    <h3>{item.title}</h3>

                                    <h1>{item.value}</h1>

                                </div>

                            </Card>
                        ))}

                    </div>

                    <div className="dashboard-section">

                        <Card>

                            <h3>Recent Activity</h3>

                            <table className="dashboard-table">

                                <thead>

                                    <tr>
                                        <th>Student</th>
                                        <th>Assessment</th>
                                        <th>Status</th>
                                        <th>Score</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((activity, index) => (
                                            <tr key={index}>
                                                <td>{activity.student_name}</td>
                                                <td>{activity.assessment}</td>
                                                <td>{activity.status}</td>
                                                <td>{activity.score}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                No recent activity
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </Card>

                    </div>
                </>
            )}

        </div>
    );

}

export default Dashboard;