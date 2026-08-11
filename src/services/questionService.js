const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getQuestions = async () => {
    const response = await fetch(`${API_BASE_URL}/questions/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data;
};

export const getQuestionsByCategory = async (category) => {
    const response = await fetch(`${API_BASE_URL}/questions/?category=${category}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch questions by category');
    }
    return await response.json();
};

export const getQuestionById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch question');
    }
    return await response.json();
};

export const addQuestion = async (question) => {
    const response = await fetch(`${API_BASE_URL}/questions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(question),
    });
    if (!response.ok) {
        throw new Error('Failed to add question');
    }
    return await response.json();
};

export const addQuestionsBatch = async (questionsArray) => {
    const response = await fetch(`${API_BASE_URL}/questions/batch/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ questions: questionsArray }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.errors?.join(', ') || 'Failed to add questions batch');
    }
    return await response.json();
};

export const updateQuestion = async (id, updatedQuestion) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedQuestion),
    });
    if (!response.ok) {
        throw new Error('Failed to update question');
    }
    return await response.json();
};

export const deleteQuestion = async (id) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete question');
    }
    return true;
};

export const deleteQuestionsBatch = async (ids) => {
    const response = await fetch(`${API_BASE_URL}/questions/batch-delete/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete questions batch');
    }
    return true;
};

export default {
    getQuestions,
    getQuestionsByCategory,
    getQuestionById,
    addQuestion,
    addQuestionsBatch,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsBatch,
};
