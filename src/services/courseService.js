const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getCourses = async () => {
    const response = await fetch(`${API_BASE_URL}/public/courses/`);
    if (!response.ok) {
        throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    return data;
};

export const getCourseById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch course');
    }
    return await response.json();
};

export const addCourse = async (course) => {
    const response = await fetch(`${API_BASE_URL}/courses/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(course),
    });
    if (!response.ok) {
        throw new Error('Failed to add course');
    }
    return await response.json();
};

export const updateCourse = async (id, updatedCourse) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedCourse),
    });
    if (!response.ok) {
        throw new Error('Failed to update course');
    }
    return await response.json();
};

export const deleteCourse = async (id) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete course');
    }
    return true;
};

export default {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
};