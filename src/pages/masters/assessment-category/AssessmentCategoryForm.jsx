import { useEffect, useState } from "react";

import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

function AssessmentCategoryForm({
    initialData = null,
    onSubmit,
    onCancel,
}) {

    const [formData, setFormData] = useState({
        categoryName: "",
        description: "",
        applicableTo: "BOTH",
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
                label="Category Name"
                name="categoryName"
                placeholder="Enter Category Name"
                value={formData.categoryName}
                onChange={handleChange}
                required
            />

            <br />

            <label>Description</label>

            <textarea
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--gray-300)",
                    borderRadius: "8px",
                    outline: "none",
                    background: "var(--white)",
                    minHeight: "80px",
                    resize: "vertical",
                }}
            />

            <br />

            <label>Applicable To</label>

            <select
                name="applicableTo"
                value={formData.applicableTo}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--gray-300)",
                    borderRadius: "8px",
                    outline: "none",
                    background: "var(--white)",
                }}
            >
                <option value="IT">IT</option>
                <option value="NON_IT">NON_IT</option>
                <option value="BOTH">BOTH</option>
            </select>

            <br />

            <label>Status</label>

            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--gray-300)",
                    borderRadius: "8px",
                    outline: "none",
                    background: "var(--white)",
                }}
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
                variant="secondary"
                onClick={onCancel}
            >
                Cancel
            </Button>

        </form>

    );

}

export default AssessmentCategoryForm;
