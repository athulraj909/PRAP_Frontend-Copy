import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const response = await authService.login(
                formData.email,
                formData.password
            );

            login(response.user, response.token);

            if (response.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="admin-login-page">
            {/* Background Shapes */}
            <div className="login-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Login Container */}
            <div className="login-container">
                {/* Logo Section */}
                <div className="login-logo-section">
                    <div className="shield-icon-large">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h1 className="login-title">PRAP Admin</h1>
                    <p className="login-subtitle">Placement Readiness Assessment Platform</p>
                </div>

                {/* Login Card */}
                <div className="login-card">
                    <div className="card-header">
                        <h2>Admin Login</h2>
                        <p>Sign in to access the admin dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <br />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <br />

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <Button
                            type="submit"
                            size="lg"
                            disabled={loading}
                            className="login-button"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                    </form>

                    <div className="card-footer">
                        <Link to="/" className="back-to-home">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    <p>© 2025 PRAP · Placement Readiness Assessment Platform</p>
                </div>
            </div>
        </div>

    );

}

export default Login;