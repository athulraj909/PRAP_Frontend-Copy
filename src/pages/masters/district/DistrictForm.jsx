import { useEffect, useState } from "react";

import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

function DistrictForm({
    initialData = null,
    onSubmit,
    onCancel,
}) {

    const [formData, setFormData] = useState({
        districtName: "",
        state: "",
        status: "Active",
    });

    useEffect(() => {

        if (initialData) {
            setFormData(initialData);
        }

    }, [initialData]);

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
                label="District Name"
                name="districtName"
                placeholder="Enter District Name"
                value={formData.districtName}
                onChange={handleChange}
                required
            />

            <br />

            <Input
                label="State"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleChange}
                required
            />

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

export default DistrictForm;