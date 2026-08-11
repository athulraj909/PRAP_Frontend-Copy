const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getAssessmentHistory = async (studentMobile) => {
    const response = await fetch(`${API_BASE_URL}/assessment-results/?student_mobile=${studentMobile}`);
    if (!response.ok) {
        throw new Error('Failed to fetch assessment history');
    }
    return await response.json();
};

export const addAssessmentRecord = async (record) => {
    const response = await fetch(`${API_BASE_URL}/assessment-results/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });
    if (!response.ok) {
        throw new Error('Failed to add assessment record');
    }
    return await response.json();
};

export const getAssessmentById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/assessment-results/${id}/`);
    if (!response.ok) {
        throw new Error('Failed to fetch assessment');
    }
    return await response.json();
};

export default {
    getAssessmentHistory,
    addAssessmentRecord,
    getAssessmentById,
};
