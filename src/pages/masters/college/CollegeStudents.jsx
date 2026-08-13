import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";

import studentService from "../../../services/studentService";
import assessmentHistoryService from "../../../services/assessmentHistoryService";

import "./CollegeStudents.css";

function CollegeStudents() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const collegeName = location.state?.collegeName || "Unknown College";
    
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [studentPerformance, setStudentPerformance] = useState({});

    useEffect(() => {
        loadStudents();
    }, [collegeName]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getStudentsByCollege(collegeName);
            setStudents(data);
            
            // Load performance data for each student
            const performanceData = {};
            for (const student of data) {
                const history = await assessmentHistoryService.getAssessmentHistory(student.mobile);
                if (history.length > 0) {
                    const totalScore = history.reduce((sum, record) => sum + record.totalScore, 0);
                    const totalPossible = history.reduce((sum, record) => sum + record.totalQuestions, 0);
                    const avgPercentage = Math.round((totalScore / totalPossible) * 100);
                    
                    performanceData[student.mobile] = {
                        totalAssessments: history.length,
                        totalScore,
                        totalPossible,
                        avgPercentage,
                        latestPercentage: history[0]?.percentage || 0,
                        latestDate: history[0]?.submittedAt || null,
                    };
                } else {
                    performanceData[student.mobile] = {
                        totalAssessments: 0,
                        totalScore: 0,
                        totalPossible: 0,
                        avgPercentage: 0,
                        latestPercentage: 0,
                        latestDate: null,
                    };
                }
            }
            setStudentPerformance(performanceData);
        } catch (err) {
            console.error("Failed to load students:", err);
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/masters/colleges");
    };

    const handleViewResult = (student) => {
        navigate(`/students/${student.mobile}`, {
            state: {
                student,
                collegeName,
                fromCollege: true,
            },
        });
    };

    const handleExport = () => {
        // Helper function to escape CSV values
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return "";
            const stringValue = String(value);
            // If value contains comma, quote, or newline, wrap in quotes and escape quotes
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Create CSV content
        const headers = ["Name", "Email", "Mobile", "District", "College", "Course", "Registered Date", "Total Assessments", "Avg Percentage", "Latest Percentage", "Latest Assessment Date"];
        const rows = filteredStudents.map(student => {
            const perf = studentPerformance[student.mobile] || {};
            return [
                escapeCSV(student.name),
                escapeCSV(student.email),
                escapeCSV(student.mobile),
                escapeCSV(student.district),
                escapeCSV(student.college),
                escapeCSV(student.course),
                escapeCSV(new Date(student.registeredAt).toLocaleDateString()),
                escapeCSV(perf.totalAssessments || 0),
                escapeCSV(perf.avgPercentage || 0),
                escapeCSV(perf.latestPercentage || 0),
                escapeCSV(perf.latestDate ? new Date(perf.latestDate).toLocaleDateString() : "N/A")
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", `${collegeName.replace(/\s+/g, "_")}_students.csv`);
        link.style.visibility = "hidden";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Export successful!");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        let yPosition = 20;

        // Calculate college overall statistics
        const totalStudents = filteredStudents.length;
        const studentsWithAssessments = filteredStudents.filter(s => studentPerformance[s.mobile]?.totalAssessments > 0).length;
        const totalAssessments = Object.values(studentPerformance).reduce(( sum, perf) => sum + (perf.totalAssessments || 0), 0);
        const collegeAvgPercentage = studentsWithAssessments > 0 
            ? Math.round(Object.values(studentPerformance).reduce((sum, perf) => sum + (perf.avgPercentage || 0), 0) / studentsWithAssessments)
            : 0;
        const passedCount = Object.values(studentPerformance).filter(perf => perf.avgPercentage >= 50).length;
        const failedCount = studentsWithAssessments - passedCount;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(22, 141, 141);
        doc.text("College Statistics Report", 105, yPosition, { align: "center" });
        yPosition += 15;

        // College Name
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`College: ${collegeName}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
        yPosition += 15;

        // Overall Statistics
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Overall Statistics", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.text(`Total Students: ${totalStudents}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Students with Assessments: ${studentsWithAssessments}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Total Assessments Taken: ${totalAssessments}`, 20, yPosition);
        yPosition += 7;
        doc.text(`College Average Percentage: ${collegeAvgPercentage}%`, 20, yPosition);
        yPosition += 7;
        doc.text(`Passed (Avg >= 50%): ${passedCount}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Failed (Avg < 50%): ${failedCount}`, 20, yPosition);
        yPosition += 15;

        // Student Details Table - Manual implementation
        const headers = ["Name", "Mobile", "Course", "Total", "Avg %", "Latest %", "Date"];
        const colWidths = [35, 25, 25, 15, 15, 15, 20];
        const startX = 20;
        const tableStartY = yPosition;
        const rowHeight = 8;

        // Draw header background
        doc.setFillColor(22, 141, 141);
        doc.rect(startX, tableStartY, 150, rowHeight, "F");
        
        // Draw header text
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        let currentX = startX;
        headers.forEach((header, index) => {
            doc.text(header, currentX + 2, tableStartY + 5);
            currentX += colWidths[index];
        });

        yPosition = tableStartY + rowHeight;

        // Draw table rows
        doc.setTextColor(0, 0, 0);
        filteredStudents.forEach((student, index) => {
            const perf = studentPerformance[student.mobile] || {};
            const rowData = [
                student.name.substring(0, 18),
                student.mobile,
                student.course.substring(0, 12),
                String(perf.totalAssessments || 0),
                perf.totalAssessments > 0 ? `${perf.avgPercentage}%` : "N/A",
                perf.totalAssessments > 0 ? `${perf.latestPercentage}%` : "N/A",
                perf.latestDate ? new Date(perf.latestDate).toLocaleDateString() : "N/A"
            ];

            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(startX, yPosition, 150, rowHeight, "F");
            }

            // Draw row text
            currentX = startX;
            rowData.forEach((cell, cellIndex) => {
                doc.text(cell, currentX + 2, yPosition + 5);
                currentX += colWidths[cellIndex];
            });

            yPosition += rowHeight;

            // Add new page if needed
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Save the PDF
        doc.save(`${collegeName.replace(/\s+/g, "_")}_Statistics.pdf`);
        toast.success("PDF exported successfully!");
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            // Search filter
            const matchesSearch = 
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.email.toLowerCase().includes(search.toLowerCase()) ||
                student.mobile.includes(search) ||
                student.district.toLowerCase().includes(search.toLowerCase()) ||
                student.course.toLowerCase().includes(search.toLowerCase());

            // Date filter
            let matchesDate = true;
            if (startDate || endDate) {
                const studentDate = new Date(student.registeredAt);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start && studentDate < start) matchesDate = false;
                if (end && studentDate > end) matchesDate = false;
            }

            return matchesSearch && matchesDate;
        });
    }, [students, search, startDate, endDate]);

    const columns = [
        {
            key: "name",
            title: "Name",
        },
        {
            key: "email",
            title: "Email",
        },
        {
            key: "mobile",
            title: "Mobile",
        },
        {
            key: "district",
            title: "District",
        },
        {
            key: "course",
            title: "Course",
        },
        {
            key: "registeredAt",
            title: "Registered Date",
            render: (row) => {
                const date = new Date(row.registeredAt);
                return date.toLocaleDateString();
            },
        },
        {
            key: "totalAssessments",
            title: "Total Assessments",
            render: (row) => {
                const perf = studentPerformance[row.mobile] || {};
                return perf.totalAssessments || 0;
            },
        },
        {
            key: "avgPercentage",
            title: "Avg Percentage",
            render: (row) => {
                const perf = studentPerformance[row.mobile] || {};
                return perf.totalAssessments > 0 ? `${perf.avgPercentage}%` : "N/A";
            },
        },
        {
            key: "latestPercentage",
            title: "Latest Percentage",
            render: (row) => {
                const perf = studentPerformance[row.mobile] || {};
                return perf.totalAssessments > 0 ? `${perf.latestPercentage}%` : "N/A";
            },
        },
        {
            key: "latestDate",
            title: "Latest Assessment Date",
            render: (row) => {
                const perf = studentPerformance[row.mobile] || {};
                if (!perf.latestDate) return "N/A";
                const date = new Date(perf.latestDate);
                return date.toLocaleDateString();
            },
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => {
                const perf = studentPerformance[row.mobile] || {};
                return (
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewResult(row)}
                        disabled={perf.totalAssessments === 0}
                    >
                        View Result
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="college-students-page">
            <div className="page-container">
                <div className="page-header">
                    <Button 
                        size="sm" 
                        onClick={handleBack}
                    >
                        ← Back to Colleges
                    </Button>
                    <h1>Students - {collegeName}</h1>
                    <div className="header-buttons">
                        <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={handleExportPDF}
                            disabled={loading || filteredStudents.length === 0}
                        >
                            Export PDF Statistics
                        </Button>
                        <Button 
                            size="sm" 
                            variant="primary"
                            onClick={handleExport}
                            disabled={loading || filteredStudents.length === 0}
                        >
                            Export to Excel
                        </Button>
                    </div>
                </div>

                <Card>
                    <div className="filters-section">
                        <div className="search-filter">
                            <Input
                                label="Search Students"
                                placeholder="Search by name, email, mobile, district, or course..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="date-filters">
                            <div className="date-filter">
                                <label>From Date:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>
                            <div className="date-filter">
                                <label>To Date:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>
                            {(startDate || endDate) && (
                                <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                    }}
                                >
                                    Clear Dates
                                </Button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <p>Loading students...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="empty-state">
                            <p>No students registered for this college yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="students-count">
                                <p>
                                    Total Registered Students: <strong>{students.length}</strong>
                                    {filteredStudents.length !== students.length && (
                                        <span> | Showing: <strong>{filteredStudents.length}</strong></span>
                                    )}
                                </p>
                            </div>
                            <DataTable
                                columns={columns}
                                data={filteredStudents}
                                emptyMessage="No students found matching your filters."
                            />
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default CollegeStudents;
