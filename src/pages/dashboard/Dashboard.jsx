import Card from "../../components/common/Card";

import "./Dashboard.css";

function Dashboard() {

    const statistics = [
        {
            title: "Total Students",
            value: "1,250",
        },
        {
            title: "Assessments",
            value: "320",
        },
        {
            title: "Colleges",
            value: "45",
        },
        {
            title: "Hireability Score",
            value: "82%",
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

                            <tr>
                                <td>John Doe</td>
                                <td>Aptitude Test</td>
                                <td>Completed</td>
                                <td>82%</td>
                            </tr>

                            <tr>
                                <td>Rahul Kumar</td>
                                <td>Communication</td>
                                <td>Completed</td>
                                <td>76%</td>
                            </tr>

                            <tr>
                                <td>Anjali Nair</td>
                                <td>Technical Test</td>
                                <td>Pending</td>
                                <td>-</td>
                            </tr>

                            <tr>
                                <td>Arun Raj</td>
                                <td>Logical Reasoning</td>
                                <td>Completed</td>
                                <td>91%</td>
                            </tr>

                        </tbody>

                    </table>

                </Card>

            </div>

        </div>
    );

}

export default Dashboard;