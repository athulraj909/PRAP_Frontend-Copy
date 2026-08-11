const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getDistricts = async () => {
    const response = await fetch(`${API_BASE_URL}/public/districts/`);
    if (!response.ok) {
        throw new Error('Failed to fetch districts');
    }
    const data = await response.json();
    return data;
};

export const getDistrictById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/districts/${id}/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch district');
    }
    return await response.json();
};

export const addDistrict = async (district) => {
    const response = await fetch(`${API_BASE_URL}/districts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(district),
    });
    if (!response.ok) {
        throw new Error('Failed to add district');
    }
    return await response.json();
};

export const updateDistrict = async (id, updatedDistrict) => {
    const response = await fetch(`${API_BASE_URL}/districts/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedDistrict),
    });
    if (!response.ok) {
        throw new Error('Failed to update district');
    }
    return await response.json();
};

export const deleteDistrict = async (id) => {
    const response = await fetch(`${API_BASE_URL}/districts/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete district');
    }
    return true;
};

export default {
    getDistricts,
    getDistrictById,
    addDistrict,
    updateDistrict,
    deleteDistrict,
};