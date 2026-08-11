import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CrudHeader from "../../../components/crud/CrudHeader";
import CrudSearch from "../../../components/crud/CrudSearch";

import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import Modal from "../../../components/common/Modal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Button from "../../../components/common/Button";

import CollegeForm from "./CollegeForm";

import collegeService from "../../../services/collegeService";

function CollegeList() {

    const navigate = useNavigate();

    const [colleges, setColleges] = useState([]);

    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedCollege, setSelectedCollege] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [collegeToDelete, setCollegeToDelete] = useState(null);

    useEffect(() => {

        loadColleges();

    }, []);

    const loadColleges = async () => {

        const data = await collegeService.getColleges();

        setColleges(data);

    };

    const filteredColleges = useMemo(() => {

        return colleges.filter((college) =>

            college.collegeName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            college.districtName
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [colleges, search]);

    const handleAdd = () => {

        setSelectedCollege(null);

        setIsModalOpen(true);

    };

    const handleEdit = (college) => {

        setSelectedCollege(college);

        setIsModalOpen(true);

    };

    const handleSave = async (formData) => {

        if (selectedCollege) {

            await collegeService.updateCollege(
                selectedCollege.id,
                formData
            );

            toast.success("College updated successfully.");

        } else {

            await collegeService.addCollege(formData);

            toast.success("College added successfully.");

        }

        setIsModalOpen(false);

        setSelectedCollege(null);

        loadColleges();

    };                              

    const handleDelete = (college) => {

        setCollegeToDelete(college);

        setDeleteDialogOpen(true);

    };

    const handleViewStudents = (college) => {

        navigate(`/masters/colleges/${college.id}/students`, { state: { collegeName: college.collegeName } });

    };

    const confirmDelete = async () => {

        if (!collegeToDelete) return;

        await collegeService.deleteCollege(
            collegeToDelete.id
        );

        toast.success("College deleted successfully.");

        setDeleteDialogOpen(false);

        setCollegeToDelete(null);

        loadColleges();

    };

    const columns = [

        {
            key: "collegeName",
            title: "College Name",
        },

        {
            key: "districtName",
            title: "District",
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
                        flexWrap: "wrap",
                    }}
                >

                    <Button
                        size="sm"
                        onClick={() => handleViewStudents(row)}
                    >
                        View Students
                    </Button>

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
                title="College Master"
                buttonText="Add College"
                onAdd={handleAdd}
            />

            <CrudSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search College..."
            />

            <DataTable
                columns={columns}
                data={filteredColleges}
                emptyMessage="No colleges found."
            />

            <Modal
                isOpen={isModalOpen}
                title={
                    selectedCollege
                        ? "Edit College"
                        : "Add College"
                }
                onClose={() => {

                    setIsModalOpen(false);

                    setSelectedCollege(null);

                }}
            >

                <CollegeForm
                    initialData={selectedCollege}
                    onSubmit={handleSave}
                    onCancel={() => {

                        setIsModalOpen(false);

                        setSelectedCollege(null);

                    }}
                />

            </Modal>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="Delete College"
                message={
                    collegeToDelete
                        ? `Are you sure you want to delete "${collegeToDelete.collegeName}"?`
                        : ""
                }
                onConfirm={confirmDelete}
                onCancel={() => {

                    setDeleteDialogOpen(false);

                    setCollegeToDelete(null);

                }}
            />

        </>

    );

}

export default CollegeList;