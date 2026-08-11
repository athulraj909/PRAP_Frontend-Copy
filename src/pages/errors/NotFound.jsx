import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f8fafc",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "80px",
                        margin: "0",
                        color: "#2563eb",
                    }}
                >
                    404
                </h1>

                <h2>Page Not Found</h2>

                <p>
                    The page you are looking for doesn't exist.
                </p>

                <Link
                    to="/"
                    style={{
                        display: "inline-block",
                        marginTop: "20px",
                        padding: "10px 20px",
                        background: "#2563eb",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "8px",
                    }}
                >
                    Back to PRAP Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;