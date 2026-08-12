const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAssessmentCategories = async () => {
    let response = await fetch(`${API_BASE_URL}/public/assessment-categories/`);

    if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/assessment-categories/`, {
            headers: getAuthHeaders(),
        });
    }

    if (!response.ok) {
        throw new Error('Failed to fetch assessment categories');
    }

    const data = await response.json();
    return data;
};

export const getAssessmentCategoryById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/assessment-categories/${id}/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch assessment category');
    }
    return await response.json();
};

export const addAssessmentCategory = async (category) => {
    const response = await fetch(`${API_BASE_URL}/assessment-categories/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        throw new Error('Failed to add assessment category');
    }
    return await response.json();
};

export const updateAssessmentCategory = async (id, updatedCategory) => {
    const response = await fetch(`${API_BASE_URL}/assessment-categories/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedCategory),
    });
    if (!response.ok) {
        throw new Error('Failed to update assessment category');
    }
    return await response.json();
};

export const deleteAssessmentCategory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/assessment-categories/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete assessment category');
    }
    return true;
};

export default {
    getAssessmentCategories,
    getAssessmentCategoryById,
    addAssessmentCategory,
    updateAssessmentCategory,
    deleteAssessmentCategory,
};
