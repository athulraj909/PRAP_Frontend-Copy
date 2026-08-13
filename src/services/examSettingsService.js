const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getExamSettings = async () => {
    // Public endpoint - no auth required for students
    const response = await fetch(`${API_BASE_URL}/public/exam-settings/`);
    if (!response.ok) {
        throw new Error('Failed to fetch exam settings');
    }
    return await response.json();
};

export const updateExamSettings = async (settings) => {
    const response = await fetch(`${API_BASE_URL}/exam-settings/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(settings),
    });
    if (!response.ok) {
        throw new Error('Failed to update exam settings');
    }
    return await response.json();
};

export default {
    getExamSettings,
    updateExamSettings,
};
