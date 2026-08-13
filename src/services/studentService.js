const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const registerStudentApi = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/student/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
    }

    // Store tokens if present
    if (data.token) {
        localStorage.setItem("studentToken", data.token);
    }
    if (data.user || data.student) {
        const studentObj = data.student || data.user;
        localStorage.setItem("studentSession", JSON.stringify(studentObj));
    }

    return data;
};

export const loginStudentApi = async (loginData) => {
    const response = await fetch(`${API_BASE_URL}/student/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Invalid mobile number or password");
    }

    if (data.token) {
        localStorage.setItem("studentToken", data.token);
    }
    if (data.user || data.student) {
        const studentObj = data.student || data.user;
        localStorage.setItem("studentSession", JSON.stringify(studentObj));
    }

    return data;
};

export const getStudents = async () => {
    const response = await fetch(`${API_BASE_URL}/students/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }
    return await response.json();
};

export const getStudentsByCollege = async (collegeName) => {
    const response = await fetch(`${API_BASE_URL}/students/?college=${encodeURIComponent(collegeName)}`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch students by college');
    }
    return await response.json();
};

export const getStudentById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`);
    if (!response.ok) {
        throw new Error('Failed to fetch student');
    }
    return await response.json();
};

export const addStudent = async (student) => {
    const response = await fetch(`${API_BASE_URL}/students/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });
    if (!response.ok) {
        throw new Error('Failed to add student');
    }
    return await response.json();
};

export const updateStudent = async (id, updatedStudent) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
    });
    if (!response.ok) {
        throw new Error('Failed to update student');
    }
    return await response.json();
};

export const deleteStudent = async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}/`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete student');
    }
    return true;
};

export const submitExam = async (examData) => {
    const response = await fetch(`${API_BASE_URL}/student/exam/submit/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to submit exam');
    }

    return data;
};

export const getExamResults = async (mobile) => {
    const response = await fetch(`${API_BASE_URL}/student/exam/results/?mobile=${mobile}`);
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch exam results');
    }

    return data;
};

export default {
    registerStudentApi,
    loginStudentApi,
    getStudents,
    getStudentsByCollege,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    submitExam,
    getExamResults,
};
