const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getColleges = async () => {
    const response = await fetch(`${API_BASE_URL}/public/colleges/`);
    if (!response.ok) {
        throw new Error('Failed to fetch colleges');
    }
    const data = await response.json();
    return data;
};

export const getCollegeById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/colleges/${id}/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch college');
    }
    return await response.json();
};

export const addCollege = async (college) => {
    const response = await fetch(`${API_BASE_URL}/colleges/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(college),
    });
    if (!response.ok) {
        throw new Error('Failed to add college');
    }
    return await response.json();
};

export const updateCollege = async (id, updatedCollege) => {
    const response = await fetch(`${API_BASE_URL}/colleges/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedCollege),
    });
    if (!response.ok) {
        throw new Error('Failed to update college');
    }
    return await response.json();
};

export const deleteCollege = async (id) => {
    const response = await fetch(`${API_BASE_URL}/colleges/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete college');
    }
    return true;
};

export default {
    getColleges,
    getCollegeById,
    addCollege,
    updateCollege,
    deleteCollege,
};