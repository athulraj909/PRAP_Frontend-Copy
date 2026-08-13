import { useLocation } from "react-router-dom";

import pageTitles from "../../config/pageTitles";

import { getCurrentUser } from "../../services/authService";

import "./Header.css";

function Header({ toggleMobileSidebar }) {

    const { pathname } = useLocation();

    const title =
        pageTitles[pathname] || "PRAP Dashboard";

    const user = getCurrentUser() || {
        name: "Administrator",
        role: "Admin",
    };

    return (

        <header className="header">

            <div className="header-left">

                <button className="mobile-menu-btn" onClick={toggleMobileSidebar}>
                    ☰
                </button>

                <h2>{title}</h2>

            </div>

            <div className="header-right">

                <button className="notification-btn">
                    🔔
                </button>

                <div className="user-profile">

                    <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="user-details">
                        <h4>{user.name}</h4>
                        <p>{user.role}</p>
                    </div>

                </div>

            </div>

        </header>

    );

}

export default Header;