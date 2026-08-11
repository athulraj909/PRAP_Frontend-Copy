import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import "./DashboardLayout.css";

function DashboardLayout() {

    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {

        setCollapsed((prev) => !prev);

    };

    return (

        <div className="dashboard-layout">

            <Sidebar
                collapsed={collapsed}
                toggleSidebar={toggleSidebar}
            />

            <div
                className={`main-wrapper ${
                    collapsed ? "expanded" : ""
                }`}
            >

                <Header />

                <main className="dashboard-content">

                    <Outlet />

                </main>

                <Footer />

            </div>

        </div>

    );

}

export default DashboardLayout;