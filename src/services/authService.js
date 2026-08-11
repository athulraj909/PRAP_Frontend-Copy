const API_BASE_URL = "http://127.0.0.1:8000/api";

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Invalid email or password');
    }

    const token = data.token || data.access;
    const loggedInUser = data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    return {
        success: true,
        token,
        user: loggedInUser,
    };
};

export const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
        success: true,
    };
};

export const getCurrentUser = () => {

    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;

};

export const getToken = () => {

    return localStorage.getItem("token");

};

export const isAuthenticated = () => {

    return !!localStorage.getItem("token");

};

export default {
    login,
    logout,
    getCurrentUser,
    getToken,
    isAuthenticated,
};