import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import CrudHeader from "../../../components/crud/CrudHeader";
import CrudSearch from "../../../components/crud/CrudSearch";

import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import Modal from "../../../components/common/Modal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Button from "../../../components/common/Button";

import DistrictForm from "./DistrictForm";

import districtService from "../../../services/districtService";

function DistrictList() {

    const [districts, setDistricts] = useState([]);

    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [districtToDelete, setDistrictToDelete] = useState(null);

    useEffect(() => {

        loadDistricts();

    }, []);

    const loadDistricts = async () => {

        const data = await districtService.getDistricts();

        setDistricts(data);

    };

    const filteredDistricts = useMemo(() => {

        return districts.filter((district) =>

            district.districtName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            district.state
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [districts, search]);

    const handleAdd = () => {

        setSelectedDistrict(null);

        setIsModalOpen(true);

    };

    const handleEdit = (district) => {

        setSelectedDistrict(district);

        setIsModalOpen(true);

    };

    const handleSave = async (formData) => {

        if (selectedDistrict) {

            await districtService.updateDistrict(
                selectedDistrict.id,
                formData
            );

            toast.success("District updated successfully.");

        } else {

            await districtService.addDistrict(formData);

            toast.success("District added successfully.");

        }

        setIsModalOpen(false);

        setSelectedDistrict(null);

        loadDistricts();

    };                              

    const handleDelete = (district) => {

        setDistrictToDelete(district);

        setDeleteDialogOpen(true);

    };

    const confirmDelete = async () => {

        if (!districtToDelete) return;

        await districtService.deleteDistrict(
            districtToDelete.id
        );

        toast.success("District deleted successfully.");

        setDeleteDialogOpen(false);

        setDistrictToDelete(null);

        loadDistricts();

    };

    const columns = [

        {
            key: "districtName",
            title: "District",
        },

        {
            key: "state",
            title: "State",
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
                title="District Master"
                buttonText="Add District"
                onAdd={handleAdd}
            />

            <CrudSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search District..."
            />

            <DataTable
                columns={columns}
                data={filteredDistricts}
                emptyMessage="No districts found."
            />

            <Modal
                isOpen={isModalOpen}
                title={
                    selectedDistrict
                        ? "Edit District"
                        : "Add District"
                }
                onClose={() => {

                    setIsModalOpen(false);

                    setSelectedDistrict(null);

                }}
            >

                <DistrictForm
                    initialData={selectedDistrict}
                    onSubmit={handleSave}
                    onCancel={() => {

                        setIsModalOpen(false);

                        setSelectedDistrict(null);

                    }}
                />

            </Modal>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="Delete District"
                message={
                    districtToDelete
                        ? `Are you sure you want to delete "${districtToDelete.districtName}"?`
                        : ""
                }
                onConfirm={confirmDelete}
                onCancel={() => {

                    setDeleteDialogOpen(false);

                    setDistrictToDelete(null);

                }}
            />

        </>

    );

}

export default DistrictList;