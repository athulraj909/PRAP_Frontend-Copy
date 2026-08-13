import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";

import studentService from "../../services/studentService";
import collegeService from "../../services/collegeService";

import "./StudentList.css";

function StudentList() {
    const navigate = useNavigate();
    
    const [students, setStudents] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [studentsData, collegesData] = await Promise.all([
                studentService.getStudents(),
                collegeService.getColleges()
            ]);
            setStudents(studentsData);
            setColleges(collegesData);
        } catch (err) {
            console.error("Failed to load data:", err);
            toast.error("Failed to load students data");
        } finally {
            setLoading(false);
        }
    };

    const handleViewCollegeStudents = (college) => {
        navigate(`/masters/colleges/${college.id}/students`, { 
            state: { collegeName: college.collegeName } 
        });
    };

    const handleExport = () => {
        const headers = ["Name", "Email", "Mobile", "District", "College", "Course", "Registered Date"];
        const rows = filteredStudents.map(student => [
            student.name,
            student.email,
            student.mobile,
            student.district,
            student.college,
            student.course,
            new Date(student.registeredAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", `all_students_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Export successful!");
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = 
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.email.toLowerCase().includes(search.toLowerCase()) ||
                student.mobile.includes(search) ||
                student.district.toLowerCase().includes(search.toLowerCase()) ||
                student.course.toLowerCase().includes(search.toLowerCase());

            const matchesCollege = !selectedCollege || student.college === selectedCollege;

            return matchesSearch && matchesCollege;
        });
    }, [students, search, selectedCollege]);

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
            key: "college",
            title: "College",
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
            key: "actions",
            title: "Actions",
            render: (row) => (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/students/${row.mobile}`, { 
                        state: { 
                            student: row,
                            collegeName: row.college 
                        } 
                    })}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div className="student-list-page">
            <div className="page-container">
                <div className="page-header">
                    <h1>All Students</h1>
                    <Button 
                        size="sm" 
                        variant="primary"
                        onClick={handleExport}
                        disabled={loading || filteredStudents.length === 0}
                    >
                        Export to Excel
                    </Button>
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
                        
                        <div className="college-filter">
                            <label>Filter by College:</label>
                            <select
                                value={selectedCollege}
                                onChange={(e) => setSelectedCollege(e.target.value)}
                                className="college-select"
                            >
                                <option value="">All Colleges</option>
                                {colleges.map(college => (
                                    <option key={college.id} value={college.collegeName}>
                                        {college.collegeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <p>Loading students...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="empty-state">
                            <p>No students registered yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="students-count">
                                <p>
                                    Total Students: <strong>{students.length}</strong>
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

export default StudentList;
