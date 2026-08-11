import "./Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">

            <div className="footer-left">
                © {currentYear} PRAP - Placement Readiness Assessment Platform
            </div>

            <div className="footer-right">
                Version 1.0
            </div>

        </footer>
    );
}

export default Footer;