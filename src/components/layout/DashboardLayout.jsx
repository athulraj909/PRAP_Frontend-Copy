import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import "./DashboardLayout.css";

function DashboardLayout() {

    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {

        setCollapsed((prev) => !prev);

    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };

    return (

        <div className="dashboard-layout">

            <Sidebar
                collapsed={collapsed}
                toggleSidebar={toggleSidebar}
                mobileSidebarOpen={mobileSidebarOpen}
                toggleMobileSidebar={toggleMobileSidebar}
            />

            <div
                className={`main-wrapper ${
                    collapsed ? "expanded" : ""
                }`}
            >

                <Header toggleMobileSidebar={toggleMobileSidebar} />

                <main className="dashboard-content">

                    <Outlet />

                </main>

                <Footer />

            </div>

        </div>

    );

}

export default DashboardLayout;