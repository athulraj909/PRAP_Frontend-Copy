import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import CrudHeader from "../../../components/crud/CrudHeader";
import CrudSearch from "../../../components/crud/CrudSearch";

import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import Modal from "../../../components/common/Modal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Button from "../../../components/common/Button";

import CourseForm from "./CourseForm";

import courseService from "../../../services/courseService";

function CourseList() {

    const [courses, setCourses] = useState([]);

    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {
        const data = await courseService.getCourses();
        setCourses(data);
    };

    const filteredCourses = useMemo(() => {

        return courses.filter((course) =>

            course.courseName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            course.duration
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [courses, search]);

    const handleAdd = () => {

        setSelectedCourse(null);

        setIsModalOpen(true);

    };

    const handleEdit = (course) => {

        setSelectedCourse(course);

        setIsModalOpen(true);

    };

    const handleSave = async (formData) => {

        if (selectedCourse) {

            await courseService.updateCourse(
                selectedCourse.id,
                formData
            );

            toast.success("Course updated successfully.");

        } else {

            await courseService.addCourse(formData);

            toast.success("Course added successfully.");

        }

        setIsModalOpen(false);

        setSelectedCourse(null);

        loadCourses();

    };                              

    const handleDelete = (course) => {

        setCourseToDelete(course);

        setDeleteDialogOpen(true);

    };

    const confirmDelete = async () => {

        if (!courseToDelete) return;

        await courseService.deleteCourse(
            courseToDelete.id
        );

        toast.success("Course deleted successfully.");

        setDeleteDialogOpen(false);

        setCourseToDelete(null);

        loadCourses();

    };

    const columns = [

        {
            key: "courseName",
            title: "Course Name",
        },

        {
            key: "duration",
            title: "Duration",
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
                title="Course Master"
                buttonText="Add Course"
                onAdd={handleAdd}
            />

            <CrudSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Course..."
            />

            <DataTable
                columns={columns}
                data={filteredCourses}
                emptyMessage="No courses found."
            />

            <Modal
                isOpen={isModalOpen}
                title={
                    selectedCourse
                        ? "Edit Course"
                        : "Add Course"
                }
                onClose={() => {

                    setIsModalOpen(false);

                    setSelectedCourse(null);

                }}
            >

                <CourseForm
                    initialData={selectedCourse}
                    onSubmit={handleSave}
                    onCancel={() => {

                        setIsModalOpen(false);

                        setSelectedCourse(null);

                    }}
                />

            </Modal>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="Delete Course"
                message={
                    courseToDelete
                        ? `Are you sure you want to delete "${courseToDelete.courseName}"?`
                        : ""
                }
                onConfirm={confirmDelete}
                onCancel={() => {

                    setDeleteDialogOpen(false);

                    setCourseToDelete(null);

                }}
            />

        </>

    );

}

export default CourseList;
