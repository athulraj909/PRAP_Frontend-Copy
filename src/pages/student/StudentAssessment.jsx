import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import collegeService from "../../services/collegeService";
import courseService from "../../services/courseService";
import districtService from "../../services/districtService";
import studentService from "../../services/studentService";

import "./StudentAssessment.css";

function StudentAssessment() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") === "login" ? "login" : "register"
    ); // 'register' or 'login'
    
    // Registration form data
    const [formData, setFormData] = useState({
        studentName: "",
        email: "",
        mobile: "",
        district: "",
        college: "",
        course: ""
    });

    // Login form data
    const [loginData, setLoginData] = useState({
        mobile: "",
        password: ""
    });

    const [districts, setDistricts] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const DEFAULT_STUDENT = {
        id: 1001,
        name: "aaa",
        email: "aaa@example.com",
        mobile: "7894561235",
        password: "PRAP@1235",
        district: "Coimbatore",
        college: "RVS College",
        course: "BCA",
        registeredAt: new Date().toISOString()
    };

    useEffect(() => {
        loadDistricts();
        loadCourses();

        // Seed default registered student if not present
        const registeredStudents = JSON.parse(localStorage.getItem("registeredStudents") || "[]");
        if (!registeredStudents.some(s => s.mobile === DEFAULT_STUDENT.mobile)) {
            registeredStudents.push(DEFAULT_STUDENT);
            localStorage.setItem("registeredStudents", JSON.stringify(registeredStudents));
        }
    }, []);

    useEffect(() => {
        // Load colleges when district changes
        if (formData.district) {
            loadCollegesByDistrict(formData.district);
        } else {
            setColleges([]);
        }
    }, [formData.district]);

    const loadDistricts = async () => {
        try {
            const data = await districtService.getDistricts();
            const activeDistricts = data.filter(district => district.status === "Active");
            setDistricts(activeDistricts);
        } catch (err) {
            console.error("Failed to load districts:", err);
        }
    };

    const loadCollegesByDistrict = async (districtName) => {
        try {
            const allColleges = await collegeService.getColleges();
            const filteredColleges = allColleges.filter(
                college => college.districtName === districtName && college.status === "Active"
            );
            setColleges(filteredColleges);
        } catch (err) {
            console.error("Failed to load colleges by district:", err);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await courseService.getCourses();
            const activeCourses = data.filter(course => course.status === "Active");
            setCourses(activeCourses);
        } catch (err) {
            console.error("Failed to load courses:", err);
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        
        // Reset college when district changes
        if (name === "district") {
            setFormData({
                ...formData,
                [name]: value,
                college: "" // Reset college when district changes
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const validateMobileNumber = (mobile) => {
        const mobileRegex = /^[0-9]{10}$/;
        return mobileRegex.test(mobile);
    };

    const checkMobileUnique = (mobile) => {
        const registeredStudents = JSON.parse(localStorage.getItem("registeredStudents") || "[]");
        return !registeredStudents.some(student => student.mobile === mobile);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateMobileNumber(formData.mobile)) {
            setError("Mobile number must be exactly 10 digits");
            return;
        }

        setLoading(true);

        try {
            const response = await studentService.registerStudentApi(formData);
            setLoading(false);
            toast.success("Registration successful! Account & password created.");
            navigate("/exam-instructions");
        } catch (err) {
            setLoading(false);
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateMobileNumber(loginData.mobile)) {
            setError("Mobile number must be exactly 10 digits");
            return;
        }

        if (!loginData.password) {
            setError("Please enter your password");
            return;
        }

        setLoading(true);

        try {
            const response = await studentService.loginStudentApi(loginData);
            setLoading(false);
            toast.success("Login successful!");
            navigate("/student-dashboard");
        } catch (err) {
            setLoading(false);
            setError(err.message || "Invalid mobile number or password");
        }
    };

    return (
        <div className="student-portal-page">
            {/* Top Navbar */}
            <header className="portal-navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <div className="shield-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            <span className="logo-title">PRAP</span>
                            <span className="logo-subtitle">Placement Readiness Assessment</span>
                        </div>
                    </Link>
                    <Link to="/" className="btn-back-home">
                        &larr; Back to Home
                    </Link>
                </div>
            </header>

            {/* Hero Header Banner */}
            <section className="portal-hero">
                <div className="portal-hero-container">
                    <span className="portal-badge">STUDENT PORTAL</span>
                    <h1 className="portal-title">
                        {activeTab === "register" ? "Create Your Student Account" : "Welcome Back, Student"}
                    </h1>
                    <p className="portal-subtitle">
                        {activeTab === "register"
                            ? "Register with your college and course details to take your 100-minute placement readiness assessment."
                            : "Log in with your registered 10-digit mobile number and password to access your portal."}
                    </p>

                    <div className="portal-features-row">
                        <div className="portal-feature-tag">
                            <span className="icon-check">✓</span> Free to Take
                        </div>
                        <div className="portal-feature-tag">
                            <span className="icon-clock">⏱</span> 100 Minute Test
                        </div>
                        <div className="portal-feature-tag">
                            <span className="icon-ribbon">🎗</span> Instant Results
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Portal Content */}
            <main className="portal-main-content">
                <div className="portal-grid">
                    {/* Form Card */}
                    <div className="portal-card">
                        {/* Segmented Tab Bar */}
                        <div className="tab-switcher">
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("register");
                                    setError("");
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="8.5" cy="7" r="4" />
                                    <line x1="20" y1="8" x2="20" y2="14" />
                                    <line x1="17" y1="11" x2="23" y2="11" />
                                </svg>
                                Register Account
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("login");
                                    setError("");
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Student Login
                            </button>
                        </div>

                        {error && (
                            <div className="portal-error-alert">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Registration Form */}
                        {activeTab === "register" && (
                            <form onSubmit={handleRegisterSubmit} className="portal-form">
                                <div className="form-grid">
                                    <div className="input-field-group">
                                        <label className="field-label">Full Name *</label>
                                        <div className="input-with-icon">
                                            <span className="field-icon">👤</span>
                                            <input
                                                type="text"
                                                name="studentName"
                                                placeholder="e.g. Alex Johnson"
                                                value={formData.studentName}
                                                onChange={handleRegisterChange}
                                                required
                                                className="custom-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-field-group">
                                        <label className="field-label">Email Address *</label>
                                        <div className="input-with-icon">
                                            <span className="field-icon">✉️</span>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="e.g. alex@example.com"
                                                value={formData.email}
                                                onChange={handleRegisterChange}
                                                required
                                                className="custom-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-field-group">
                                        <label className="field-label">Mobile Number *</label>
                                        <div className="input-with-icon">
                                            <span className="field-icon">📱</span>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                placeholder="10-digit mobile number"
                                                value={formData.mobile}
                                                onChange={handleRegisterChange}
                                                required
                                                className="custom-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-field-group">
                                        <label className="field-label">District *</label>
                                        <div className="input-with-icon">
                                            <span className="field-icon">📍</span>
                                            <select
                                                name="district"
                                                value={formData.district}
                                                onChange={handleRegisterChange}
                                                required
                                                className="custom-select"
                                            >
                                                <option value="">Select District</option>
                                                {districts && districts.length > 0 ? (
                                                    districts.map((district) => (
                                                        <option key={district.id} value={district.districtName}>
                                                            {district.districtName}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Loading districts...</option>
                                                )}
                                            </select>
                                        </div>
                                        {districts.length === 0 && (
                                            <small className="field-hint">No active districts found</small>
                                        )}
                                    </div>

                                    <div className="input-field-group">
                                        <label className="field-label">College/University *</label>
                                        <div className="input-with-icon">
                                            <span className="field-icon">🏛️</span>
                                            <select
                                                name="college"
                                                value={formData.college}
                                                onChange={handleRegisterChange}
                                                required
                                                disabled={!formData.district}
                                                className="custom-select"
                                            >
                                                <option value="">
                                                    {formData.district ? "Select College" : "Select District First"}
                                                </option>
                                                {colleges.map((college) => (
                                                    <option key={college.id} value={college.collegeName}>
                                                        {college.collegeName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {!formData.district && (
                                            <small className="field-hint">Please select a district above first</small>
                                        )}
                                        {formData.district && colleges.length === 0 && (
                                            <small className="field-hint">No colleges listed for this district</small>
                                        )}
                                    </div>

                                    <div className="input-field-group">
                                        <label className="field-label">Course/Stream *</label>
                                        <div className="input-with-icon">
                                            <span className="field-icon">🎓</span>
                                            <select
                                                name="course"
                                                value={formData.course}
                                                onChange={handleRegisterChange}
                                                required
                                                className="custom-select"
                                            >
                                                <option value="">Select Course</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-submit-row">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-portal-primary"
                                    >
                                        {loading ? "Registering Account..." : "Register Now →"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="btn-portal-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Login Form */}
                        {activeTab === "login" && (
                            <form onSubmit={handleLoginSubmit} className="portal-form login-form-wrapper">
                                <div className="input-field-group">
                                    <label className="field-label">Registered Mobile Number *</label>
                                    <div className="input-with-icon">
                                        <span className="field-icon">📱</span>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Enter your 10-digit mobile number"
                                            value={loginData.mobile}
                                            onChange={handleLoginChange}
                                            required
                                            className="custom-input"
                                        />
                                    </div>
                                </div>

                                <div className="input-field-group">
                                    <label className="field-label">Password *</label>
                                    <div className="input-with-icon">
                                        <span className="field-icon">🔒</span>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter your account password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            required
                                            className="custom-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-submit-row">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-portal-primary"
                                    >
                                        {loading ? "Signing In..." : "Student Login →"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="btn-portal-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div style={{ marginTop: '18px', padding: '14px', backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#166534' }}>
                                    <div style={{ fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>🔑</span> Registered Student Credentials (User aaa):
                                    </div>
                                    <div>Mobile Number: <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>7894561235</code></div>
                                    <div style={{ marginTop: '3px' }}>Password: <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>PRAP@1235</code></div>
                                </div>
                            </form>
                        )}
                    </div>


                </div>
            </main>

            {/* Portal Footer */}
            <footer className="portal-footer">
                <div className="footer-container">
                    <p className="footer-copyright">
                        © 2025 PRAP · Placement Readiness Assessment Platform · All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default StudentAssessment;
