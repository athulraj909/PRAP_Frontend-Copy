const sidebarMenu = [

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
        icon: "📝",
        children: [
            {
                title: "IT",
                path: "/assessments/it",
            },
            {
                title: "Non-IT",
                path: "/assessments/non-it",
            },
        ],
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

export default sidebarMenu;