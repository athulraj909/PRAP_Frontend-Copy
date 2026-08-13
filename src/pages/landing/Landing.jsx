import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
    const features = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="m9 14 2 2 4-4" />
                </svg>
            ),
            title: "Smart Assessments",
            description: "Auto-generated tests tailored to IT and Non-IT course types with category-wise scoring."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
            title: "Hireability Score",
            description: "AI-inspired scoring across aptitude, reasoning, verbal, and technical categories."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            title: "Resume Anytime",
            description: "Unique resume tokens ensure students never lose progress even if connectivity drops."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
            ),
            title: "Instant Results",
            description: "Category-wise performance breakdown with downloadable PDF report after submission."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            ),
            title: "College Analytics",
            description: "Admins get district and college-level placement readiness dashboards in real time."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            ),
            title: "One Attempt Only",
            description: "Mobile-number validated single-attempt rule ensures assessment integrity."
        }
    ];

    const categories = [
        { name: "Quantitative Aptitude", tag: "BOTH", type: "gray" },
        { name: "Logical Reasoning", tag: "BOTH", type: "gray" },
        { name: "Verbal Ability", tag: "BOTH", type: "gray" },
        { name: "Computer Fundamentals", tag: "IT", type: "teal" },
        { name: "Programming", tag: "IT", type: "teal" },
        { name: "Python", tag: "IT", type: "teal" },
        { name: "SQL", tag: "IT", type: "teal" },
        { name: "General Aptitude", tag: "BOTH", type: "gray" }
    ];

    return (
        <div className="landing-page">
            {/* Top Navbar */}
            <header className="landing-navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <div className="logo-icon">
                            <img src="/assets/logo-final.svg" alt="PRAP Logo" />
                        </div>
                        <div className="logo-text">
                            <span className="logo-title">PRAP</span>
                            <span className="logo-subtitle">Placement Readiness Assessment</span>
                        </div>
                    </div>
                    <div className="navbar-actions">
                        <Link to="/student-assessment?tab=login" className="btn-login-nav">
                            Login
                        </Link>
                        <Link to="/student-assessment" className="btn-take-assessment-nav">
                            Take Assessment &gt;
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
                <div className="hero-container">
                    <h1 className="hero-title">Know Your Placement Readiness</h1>

                    <p className="hero-description">
                        Take the PRAP assessment to discover your hireability score across
                        aptitude, reasoning, verbal and technical categories — in under 100 minutes.
                    </p>

                    <div className="hero-cta-buttons">
                        <Link to="/student-assessment" className="btn-hero-primary">
                            <span className="play-icon">▶</span> Take Assessment &rarr;
                        </Link>
                    </div>

                    <div className="hero-features-bar">
                        <div className="feature-pill">
                            <span className="check-icon">✓</span> Free to Take
                        </div>
                        <div className="feature-pill">
                            <span className="clock-icon">⏱</span> 100 Minute Test
                        </div>
                        <div className="feature-pill">
                            <span className="ribbon-icon">🎗</span> Instant Results
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-curve">
                    <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
                        <path d="M0 0C480 80 960 80 1440 0V100H0V0Z" fill="#ffffff" />
                    </svg>
                </div>
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#168d8d" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="stat-number">1,626+</div>
                        <div className="stat-label">Students Registered</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#168d8d" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>
                        <div className="stat-number">28</div>
                        <div className="stat-label">Colleges Onboarded</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#168d8d" strokeWidth="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <div className="stat-number">71.4%</div>
                        <div className="stat-label">Average Score</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#168d8d" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <div className="stat-number">97%</div>
                        <div className="stat-label">Highest Score</div>
                    </div>
                </div>
            </section>

            {/* Why PRAP Features Grid Section */}
            <section className="why-prap-section">
                <div className="section-header">
                    <span className="section-subtitle">WHY PRAP</span>
                    <h2 className="section-title">Everything you need in one assessment</h2>
                </div>

                <div className="features-grid-container">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-box">
                            <div className="feature-icon-bubble">
                                {feature.icon}
                            </div>
                            <h3 className="feature-box-title">{feature.title}</h3>
                            <p className="feature-box-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section">
                <div className="process-container">
                    <div className="section-header">
                        <span className="section-subtitle">PROCESS</span>
                        <h2 className="section-title">How it works</h2>
                    </div>

                    <div className="process-steps-row">
                        <div className="process-line"></div>
                        <div className="step-card">
                            <div className="step-badge">
                                <span className="step-num">01</span>
                                <span className="step-title">Register</span>
                            </div>
                            <p className="step-desc">Fill in your college and course details once.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-badge">
                                <span className="step-num">02</span>
                                <span className="step-title">Get Credentials</span>
                            </div>
                            <p className="step-desc">Receive login credentials instantly via email.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-badge">
                                <span className="step-num">03</span>
                                <span className="step-title">Take the Test</span>
                            </div>
                            <p className="step-desc">Attempt the timed MCQ assessment at your convenience.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-badge">
                                <span className="step-num">04</span>
                                <span className="step-title">View Results</span>
                            </div>
                            <p className="step-desc">Download your hireability report with category scores.</p>
                        </div>
                    </div>

                    <div className="process-cta">
                        <Link to="/student-assessment" className="btn-process-action">
                            <span className="play-icon">▶</span> Start Your Assessment Now &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="categories-container">
                    <div className="section-header">
                        <span className="section-subtitle">WHAT'S TESTED</span>
                        <h2 className="section-title">Assessment Categories</h2>
                    </div>

                    <div className="categories-pills-row">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className={`category-pill ${cat.type === "teal" ? "pill-teal" : "pill-gray"}`}
                            >
                                <span className="pill-name">{cat.name}</span>
                                <span className={`pill-tag ${cat.type === "teal" ? "tag-teal" : "tag-gray"}`}>
                                    {cat.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Call-To-Action Banner */}
            <section className="cta-banner-section">
                <div className="cta-banner-container">
                    <h2 className="cta-title">Ready to get placed?</h2>
                    <p className="cta-subtitle">
                        Join 1,600+ students who have already taken the assessment. Your hireability score is one click away.
                    </p>
                    <div className="cta-button-wrapper">
                        <Link to="/student-assessment" className="btn-cta-white">
                            <span className="play-icon">▶</span> Take Assessment &rarr;
                        </Link>
                    </div>
                    <p className="cta-subcaption">Free · One attempt · Instant results</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#168d8d" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span className="footer-title">PRAP</span>
                    </div>
                    <p className="footer-copyright">
                        © 2025 PRAP · Placement Readiness Assessment Platform · Powered by OneTeam · All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
