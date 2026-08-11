import { useEffect, useState } from "react";

import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

import districtService from "../../../services/districtService";

function CollegeForm({
    initialData = null,
    onSubmit,
    onCancel,
}) {

    const [formData, setFormData] = useState({
        collegeName: "",
        district: "",
        status: "Active",
    });

    const [districts, setDistricts] = useState([]);

    useEffect(() => {

        if (initialData) {
            setFormData({
                collegeName: initialData.collegeName,
                district: initialData.district,
                status: initialData.status,
            });
        }

        loadDistricts();

    }, [initialData]);

    const loadDistricts = async () => {
        try {
            const data = await districtService.getDistricts();
            setDistricts(data.filter(district => district.status === "Active"));
        } catch (err) {
            console.error("Failed to load districts:", err);
        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (

        <form onSubmit={handleSubmit}>

            <Input
                label="College Name"
                name="collegeName"
                placeholder="Enter College Name"
                value={formData.collegeName}
                onChange={handleChange}
                required
            />

            <br />

            <div className="form-group">
                <label>District *</label>
                <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.districtName}
                        </option>
                    ))}
                </select>
            </div>

            <br />

            <label>Status</label>

            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
            >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>

            <br />
            <br />

            <Button type="submit">
                {initialData ? "Update" : "Save"}
            </Button>

            {" "}

            <Button
                type="button"
                onClick={onCancel}
            >
                Cancel
            </Button>

        </form>

    );

}

export default CollegeForm;