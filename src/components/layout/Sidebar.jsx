import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

const menuItems = [

    {
        title: "Dashboard",
        path: "/dashboard",
        icon: "🏠",
    },

    {
        title: "Masters",
        icon: "🗂️",
        children: [

            {
                title: "District",
                path: "/masters/districts",
            },

            {
                title: "College",
                path: "/masters/colleges",
            },

            {
                title: "Course",
                path: "/masters/courses",
            },

            {
                title: "Assessment Category",
                path: "/masters/assessment-categories",
            },

        ],
    },

    {
        title: "Students",
        path: "/students",
        icon: "🎓",
    },

    {
        title: "Assessments",
        path: "/assessments",
        icon: "📝",
    },

    {
        title: "Questions",
        path: "/questions",
        icon: "❓",
    },

    {
        title: "Reports",
        path: "/reports",
        icon: "📊",
    },

    {
        title: "Settings",
        path: "/settings",
        icon: "⚙️",
    },

];

function Sidebar({
    collapsed,
    toggleSidebar,
}) {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const [openMenus, setOpenMenus] = useState({
        Masters: true,
    });

    const toggleMenu = (menu) => {

        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));

    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (

        <aside
            className={`sidebar ${
                collapsed ? "collapsed" : ""
            }`}
        >

            <div className="sidebar-header">

                <h2 className="logo">
                    {collapsed ? "P" : "PRAP"}
                </h2>

                <button
                    className="collapse-btn"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>

            </div>

            <nav className="sidebar-menu">

                {

                    menuItems.map((item) => (

                        item.children ? (

                            <div
                                key={item.title}
                                className="menu-group"
                            >

                                <button
                                    className="menu-parent"
                                    onClick={() =>
                                        toggleMenu(item.title)
                                    }
                                >

                                    <span>

                                        {item.icon}

                                        {!collapsed && (
                                            <> {item.title}</>
                                        )}

                                    </span>

                                    {

                                        !collapsed && (

                                            <span>

                                                {

                                                    openMenus[item.title]

                                                        ? "▲"

                                                        : "▼"

                                                }

                                            </span>

                                        )

                                    }

                                </button>

                                {

                                    openMenus[item.title] &&
                                    !collapsed && (

                                        <div className="submenu">

                                            {

                                                item.children.map(
                                                    (child) => (

                                                        <NavLink
                                                            key={child.path}
                                                            to={child.path}
                                                            className={({ isActive }) =>
                                                                isActive
                                                                    ? "submenu-item active"
                                                                    : "submenu-item"
                                                            }
                                                        >

                                                            {child.title}

                                                        </NavLink>

                                                    )
                                                )

                                            }

                                        </div>

                                    )

                                }

                            </div>

                        ) : (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "menu-item active"
                                        : "menu-item"
                                }
                            >

                                <span className="menu-icon">
                                    {item.icon}
                                </span>

                                {

                                    !collapsed && (

                                        <span className="menu-title">
                                            {item.title}
                                        </span>

                                    )

                                }

                            </NavLink>

                        )

                    ))

                }

            </nav>

            <div className="sidebar-footer">

                {

                    !collapsed && (

                        <>

                            <p>
                                Placement Readiness
                            </p>

                            <small>
                                Version 1.0
                            </small>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                🚪 Logout
                            </button>

                        </>

                    )

                }

                {

                    collapsed && (

                        <button
                            className="logout-btn collapsed"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            🚪
                        </button>

                    )

                }

            </div>

        </aside>

    );

}

export default Sidebar;