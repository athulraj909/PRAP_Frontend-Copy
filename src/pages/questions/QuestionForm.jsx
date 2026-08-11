import { useEffect, useState } from "react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function QuestionForm({
    initialData = null,
    categories = [],
    onSubmit,
    onCancel,
}) {

    const [formData, setFormData] = useState({
        categoryId: "",
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        explanation: "",
        marks: 1,
        negativeMarks: 0,
        status: "Active",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                categoryId: initialData.categoryId || initialData.category || ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Category</label>
            <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--gray-300)",
                    borderRadius: "8px",
                    outline: "none",
                    background: "var(--white)",
                }}
            >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                    </option>
                ))}
            </select>

            <br />

            <label>Question</label>
            <textarea
                name="question"
                placeholder="Enter the question"
                value={formData.question}
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <Input
                        label="Option A"
                        name="optionA"
                        placeholder="Enter Option A"
                        value={formData.optionA}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Input
                        label="Option B"
                        name="optionB"
                        placeholder="Enter Option B"
                        value={formData.optionB}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <br />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <Input
                        label="Option C"
                        name="optionC"
                        placeholder="Enter Option C"
                        value={formData.optionC}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Input
                        label="Option D"
                        name="optionD"
                        placeholder="Enter Option D"
                        value={formData.optionD}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <br />

            <label>Correct Answer</label>
            <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                required
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--gray-300)",
                    borderRadius: "8px",
                    outline: "none",
                    background: "var(--white)",
                }}
            >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
            </select>

            <br />

            <label>Explanation</label>
            <textarea
                name="explanation"
                placeholder="Enter explanation for the correct answer"
                value={formData.explanation}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--gray-300)",
                    borderRadius: "8px",
                    outline: "none",
                    background: "var(--white)",
                    minHeight: "60px",
                    resize: "vertical",
                }}
            />

            <br />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <Input
                        label="Marks"
                        name="marks"
                        type="number"
                        placeholder="Enter marks"
                        value={formData.marks}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>
                <div>
                    <Input
                        label="Negative Marks"
                        name="negativeMarks"
                        type="number"
                        placeholder="Enter negative marks"
                        value={formData.negativeMarks}
                        onChange={handleChange}
                        min="0"
                    />
                </div>
            </div>

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

export default QuestionForm;
