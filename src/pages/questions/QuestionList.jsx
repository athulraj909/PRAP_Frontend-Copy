import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import CrudHeader from "../../components/crud/CrudHeader";
import CrudSearch from "../../components/crud/CrudSearch";

import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Button from "../../components/common/Button";

import QuestionForm from "./QuestionForm";
import QuestionImport from "./QuestionImport";

import questionService from "../../services/questionService";
import assessmentCategoryService from "../../services/assessmentCategoryService";

function QuestionList() {

    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

    useEffect(() => {
        loadQuestions();
        loadCategories();
    }, []);

    const loadQuestions = async () => {
        try {
            const data = await questionService.getQuestions();
            setQuestions(data);
        } catch (error) {
            console.error("Failed to load questions:", error);
            toast.error("Failed to load questions");
        }
    };

    const loadCategories = async () => {
        const data = await assessmentCategoryService.getAssessmentCategories();
        setCategories(data);
    };

    const filteredQuestions = useMemo(() => {
        return questions.filter((question) => {
            const matchesSearch =
                question.question.toLowerCase().includes(search.toLowerCase()) ||
                question.categoryName.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = !categoryFilter || question.categoryName === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [questions, search, categoryFilter]);

    const handleAdd = () => {
        setSelectedQuestion(null);
        setIsModalOpen(true);
    };

    const handleImport = () => {
        setIsImportModalOpen(true);
    };

    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        if (selectedQuestion) {
            await questionService.updateQuestion(
                selectedQuestion.id,
                formData
            );
            toast.success("Question updated successfully.");
        } else {
            await questionService.addQuestion(formData);
            toast.success("Question added successfully.");
        }
        setIsModalOpen(false);
        setSelectedQuestion(null);
        loadQuestions();
    };

    const handleDelete = (question) => {
        setQuestionToDelete(question);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!questionToDelete) return;
        await questionService.deleteQuestion(questionToDelete.id);
        toast.success("Question deleted successfully.");
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
        setSelectedIds((prev) =>
            prev.filter((id) => id !== questionToDelete.id)
        );
        loadQuestions();
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((selectedId) => selectedId !== id)
                : [...prev, id]
        );
    };

    const allFilteredSelected =
        filteredQuestions.length > 0 &&
        filteredQuestions.every((question) =>
            selectedIds.includes(question.id)
        );

    const handleSelectAll = () => {
        if (allFilteredSelected) {
            const filteredIds = new Set(
                filteredQuestions.map((question) => question.id)
            );
            setSelectedIds((prev) =>
                prev.filter((id) => !filteredIds.has(id))
            );
        } else {
            const mergedIds = new Set([
                ...selectedIds,
                ...filteredQuestions.map((question) => question.id),
            ]);
            setSelectedIds([...mergedIds]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setBulkDeleteDialogOpen(true);
    };

    const confirmBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        const count = selectedIds.length;
        await questionService.deleteQuestionsBatch(selectedIds);
        toast.success(`${count} question${count > 1 ? "s" : ""} deleted successfully.`);
        setBulkDeleteDialogOpen(false);
        setSelectedIds([]);
        loadQuestions();
    };

    const handleImportSuccess = () => {
        setIsImportModalOpen(false);
        loadQuestions();
        toast.success("Questions imported successfully.");
    };

    const columns = [
        {
            key: "select",
            title: "",
            headerRender: () => (
                <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all questions"
                />
            ),
            render: (row) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                    aria-label={`Select question ${row.id}`}
                />
            ),
        },
        {
            key: "categoryName",
            title: "Category",
        },
        {
            key: "question",
            title: "Question",
            render: (row) => (
                <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {row.question}
                </div>
            ),
        },
        {
            key: "marks",
            title: "Marks",
        },
        {
            key: "correctAnswer",
            title: "Correct Answer",
        },
        {
            key: "status",
            title: "Status",
            render: (row) => (
                <StatusBadge
                    status={row.status}
                />
            ),
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        size="sm"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleDelete(row)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <CrudHeader
                title="Questions Management"
                buttonText="Add Question"
                onAdd={handleAdd}
                extraButtons={
                    <Button
                        variant="secondary"
                        onClick={handleImport}
                    >
                        Import Excel
                    </Button>
                }
            />

            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                <CrudSearch
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Question..."
                    style={{ flex: 1 }}
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                        padding: "12px",
                        border: "2px solid var(--gray-300)",
                        borderRadius: "8px",
                        outline: "none",
                        background: "var(--white)",
                        minWidth: "200px",
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.categoryName}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedIds.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                        padding: "12px 16px",
                        background: "var(--gray-50)",
                        borderRadius: "8px",
                        border: "1px solid var(--gray-300)",
                    }}
                >
                    <span style={{ fontWeight: 600 }}>
                        {selectedIds.length} selected
                    </span>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        Delete Selected
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIds([])}
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={filteredQuestions}
                emptyMessage="No questions found."
            />

            <Modal
                isOpen={isModalOpen}
                title={
                    selectedQuestion
                        ? "Edit Question"
                        : "Add Question"
                }
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedQuestion(null);
                }}
                scrollable={true}
            >
                <QuestionForm
                    initialData={selectedQuestion}
                    categories={categories}
                    onSubmit={handleSave}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedQuestion(null);
                    }}
                />
            </Modal>

            <Modal
                isOpen={isImportModalOpen}
                title="Import Questions from Excel"
                onClose={() => {
                    setIsImportModalOpen(false);
                }}
            >
                <QuestionImport
                    categories={categories}
                    onSuccess={handleImportSuccess}
                    onCancel={() => {
                        setIsImportModalOpen(false);
                    }}
                />
            </Modal>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="Delete Question"
                message={
                    questionToDelete
                        ? `Are you sure you want to delete this question?`
                        : ""
                }
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setQuestionToDelete(null);
                }}
            />

            <ConfirmDialog
                isOpen={bulkDeleteDialogOpen}
                title="Delete Selected Questions"
                message={`Are you sure you want to delete ${selectedIds.length} selected question${selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.`}
                onConfirm={confirmBulkDelete}
                onCancel={() => setBulkDeleteDialogOpen(false)}
            />
        </>
    );
}

export default QuestionList;
