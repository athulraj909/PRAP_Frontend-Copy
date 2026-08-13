const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getDashboardStats = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
    }
    return await response.json();
};

export const getRecentActivity = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-activity/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
    }
    return await response.json();
};

export default {
    getDashboardStats,
    getRecentActivity,
};
