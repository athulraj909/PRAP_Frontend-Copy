import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import CrudHeader from "../../../components/crud/CrudHeader";
import CrudSearch from "../../../components/crud/CrudSearch";

import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import Modal from "../../../components/common/Modal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Button from "../../../components/common/Button";

import AssessmentCategoryForm from "./AssessmentCategoryForm";

import assessmentCategoryService from "../../../services/assessmentCategoryService";

function AssessmentCategoryList() {

    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {

        loadCategories();

    }, []);

    const loadCategories = async () => {
        try {
            const data = await assessmentCategoryService.getAssessmentCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load assessment categories:", error);
            toast.error("Failed to load assessment categories");
        }
    };

    const filteredCategories = useMemo(() => {

        return categories.filter((category) =>

            category.categoryName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            category.description
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [categories, search]);

    const handleAdd = () => {

        setSelectedCategory(null);

        setIsModalOpen(true);

    };

    const handleEdit = (category) => {

        setSelectedCategory(category);

        setIsModalOpen(true);

    };

    const handleSave = async (formData) => {

        if (selectedCategory) {

            await assessmentCategoryService.updateAssessmentCategory(
                selectedCategory.id,
                formData
            );

            toast.success("Assessment category updated successfully.");

        } else {

            await assessmentCategoryService.addAssessmentCategory(formData);

            toast.success("Assessment category added successfully.");

        }

        setIsModalOpen(false);

        setSelectedCategory(null);

        loadCategories();

    };                              

    const handleDelete = (category) => {

        setCategoryToDelete(category);

        setDeleteDialogOpen(true);

    };

    const confirmDelete = async () => {

        if (!categoryToDelete) return;

        await assessmentCategoryService.deleteAssessmentCategory(
            categoryToDelete.id
        );

        toast.success("Assessment category deleted successfully.");

        setDeleteDialogOpen(false);

        setCategoryToDelete(null);

        loadCategories();

    };

    const columns = [

        {
            key: "categoryName",
            title: "Category Name",
        },

        {
            key: "description",
            title: "Description",
        },

        {
            key: "applicableTo",
            title: "Applicable To",
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

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                    }}
                >

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
                title="Assessment Category Master"
                buttonText="Add Category"
                onAdd={handleAdd}
            />

            <CrudSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Category..."
            />

            <DataTable
                columns={columns}
                data={filteredCategories}
                emptyMessage="No assessment categories found."
            />

            <Modal
                isOpen={isModalOpen}
                title={
                    selectedCategory
                        ? "Edit Assessment Category"
                        : "Add Assessment Category"
                }
                onClose={() => {

                    setIsModalOpen(false);

                    setSelectedCategory(null);

                }}
            >

                <AssessmentCategoryForm
                    initialData={selectedCategory}
                    onSubmit={handleSave}
                    onCancel={() => {

                        setIsModalOpen(false);

                        setSelectedCategory(null);

                    }}
                />

            </Modal>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="Delete Assessment Category"
                message={
                    categoryToDelete
                        ? `Are you sure you want to delete "${categoryToDelete.categoryName}"?`
                        : ""
                }
                onConfirm={confirmDelete}
                onCancel={() => {

                    setDeleteDialogOpen(false);

                    setCategoryToDelete(null);

                }}
            />

        </>

    );

}

export default AssessmentCategoryList;
