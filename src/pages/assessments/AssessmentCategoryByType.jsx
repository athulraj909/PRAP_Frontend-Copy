import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CrudHeader from "../../components/crud/CrudHeader";
import CrudSearch from "../../components/crud/CrudSearch";

import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import assessmentCategoryService from "../../services/assessmentCategoryService";
import questionService from "../../services/questionService";

import "./AssessmentCategoryByType.css";

function AssessmentCategoryByType() {
    const { type } = useParams();

    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [search, setSearch] = useState("");
    const [isPercentageModalOpen, setIsPercentageModalOpen] = useState(false);
    const [percentageInputs, setPercentageInputs] = useState({});
    const [saving, setSaving] = useState(false);

    const targetField = type === "it" ? "itPercentage" : "nonItPercentage";

    useEffect(() => {
        loadData();
    }, [type]);

    const loadData = async () => {
        try {
            const categoriesData = await assessmentCategoryService.getAssessmentCategories();
            const questionsData = await questionService.getQuestions();
            setCategories(categoriesData);
            setQuestions(questionsData);
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load data");
        }
    };

    const getQuestionCountForCategory = (catId, catName) => {
        return questions.filter(
            (q) =>
                q.categoryId === catId ||
                q.category === catId ||
                (catName && q.categoryName === catName)
        ).length;
    };

    const getTotalQuestions = () => {
        return questions.length;
    };

    const getCalculatedPercentage = (count) => {
        const total = getTotalQuestions();
        if (total === 0) return 0;
        return ((count / total) * 100).toFixed(1);
    };

    const applicableCategories = useMemo(() => {
        let filtered = categories;
        if (type === "it") {
            filtered = categories.filter(
                (cat) => cat.applicableTo === "IT" || cat.applicableTo === "BOTH"
            );
        } else if (type === "non-it") {
            filtered = categories.filter(
                (cat) => cat.applicableTo === "NON_IT" || cat.applicableTo === "BOTH"
            );
        }

        // Filter out categories that have 0 questions
        return filtered.filter((cat) => {
            const count = getQuestionCountForCategory(cat.id, cat.categoryName);
            return count > 0;
        });
    }, [categories, questions, type]);

    const filteredCategories = useMemo(() => {
        return applicableCategories.filter((category) =>
            category.categoryName
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            (category.description &&
                category.description
                    .toLowerCase()
                    .includes(search.toLowerCase()))
        );
    }, [applicableCategories, search]);

    const handleOpenPercentageModal = () => {
        const initialMap = {};
        applicableCategories.forEach((cat) => {
            const val = cat[targetField];
            const defaultPct = val !== undefined && val !== null && val > 0
                ? val
                : parseFloat(getCalculatedPercentage(getQuestionCountForCategory(cat.id, cat.categoryName)));
            initialMap[cat.id] = defaultPct;
        });
        setPercentageInputs(initialMap);
        setIsPercentageModalOpen(true);
    };

    const handlePercentageInputChange = (catId, value) => {
        setPercentageInputs((prev) => ({
            ...prev,
            [catId]: value,
        }));
    };

    const totalPercentageSum = useMemo(() => {
        return Object.values(percentageInputs).reduce((acc, val) => {
            const num = parseFloat(val);
            return acc + (isNaN(num) ? 0 : num);
        }, 0);
    }, [percentageInputs]);

    const isTotal100 = useMemo(() => {
        return Math.abs(totalPercentageSum - 100) < 0.01;
    }, [totalPercentageSum]);

    const handleSavePercentages = async () => {
        if (!isTotal100) {
            toast.error("Total percentage must equal 100% to submit.");
            return;
        }
        setSaving(true);
        try {
            for (const cat of applicableCategories) {
                const newPct = parseFloat(percentageInputs[cat.id]) || 0;
                await assessmentCategoryService.updateAssessmentCategory(cat.id, {
                    ...cat,
                    [targetField]: newPct,
                    percentage: newPct, // Keep fallback updated as well
                });
            }
            toast.success(`${type === "it" ? "IT" : "Non-IT"} category percentages updated successfully.`);
            setIsPercentageModalOpen(false);
            loadData();
        } catch (error) {
            console.error("Failed to update percentages:", error);
            toast.error("Failed to update percentages");
        } finally {
            setSaving(false);
        }
    };

    const getTitle = () => {
        if (type === "it") return "IT Assessments";
        if (type === "non-it") return "Non-IT Assessments";
        return "All Assessments";
    };

    const getCategoryDisplayPercentage = (row) => {
        const val = row[targetField];
        if (val !== undefined && val !== null && val > 0) {
            return Number(val).toFixed(1);
        }
        const count = getQuestionCountForCategory(row.id, row.categoryName);
        return getCalculatedPercentage(count);
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
            render: (row) => {
                let bgColor = "#e3f2fd";
                let color = "#1976d2";

                if (row.applicableTo === "NON_IT") {
                    bgColor = "#f3e5f5";
                    color = "#7b1fa2";
                } else if (row.applicableTo === "BOTH") {
                    bgColor = "#e8f5e9";
                    color = "#388e3c";
                }

                return (
                    <span
                        style={{
                            backgroundColor: bgColor,
                            color: color,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "500",
                        }}
                    >
                        {row.applicableTo}
                    </span>
                );
            },
        },

        {
            key: "questionPercentage",
            title: `${type === "it" ? "IT" : "Non-IT"} %`,
            render: (row) => {
                const percentage = getCategoryDisplayPercentage(row);
                return (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: "8px",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "4px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                                    backgroundColor: "#4caf50",
                                    transition: "width 0.3s ease",
                                }}
                            />
                        </div>
                        <span
                            style={{
                                minWidth: "55px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            {percentage}%
                        </span>
                    </div>
                );
            },
        },

        {
            key: "status",
            title: "Status",
            render: (row) => <StatusBadge status={row.status} />,
        },
    ];

    return (
        <>
            <div style={{ marginBottom: "20px" }}>
                <CrudHeader title={getTitle()} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gap: "10px" }}>
                    <Button
                        size="md"
                        onClick={handleOpenPercentageModal}
                        style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "8px 18px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "500",
                            boxShadow: "0 2px 4px rgba(0,123,255,0.2)"
                        }}
                    >
                        Edit
                    </Button>
                </div>
            </div>

            <CrudSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Category..."
            />

            <DataTable
                columns={columns}
                data={filteredCategories}
                emptyMessage="No assessment categories with questions found."
            />

            <Modal
                isOpen={isPercentageModalOpen}
                title={`Edit Category Percentages (${getTitle()})`}
                onClose={() => setIsPercentageModalOpen(false)}
            >
                <div className="percentage-modal-container">
                    <div className="percentage-modal-header">
                        <p>Configure {type === "it" ? "IT" : "Non-IT"} percentage weightage for categories in <strong>{getTitle()}</strong>. Total must equal <strong>100%</strong> to submit.</p>
                    </div>

                    <div className="category-percentage-list">
                        {applicableCategories.map((cat) => {
                            let badgeBg = "#e3f2fd";
                            let badgeColor = "#1976d2";
                            if (cat.applicableTo === "NON_IT") {
                                badgeBg = "#f3e5f5";
                                badgeColor = "#7b1fa2";
                            } else if (cat.applicableTo === "BOTH") {
                                badgeBg = "#e8f5e9";
                                badgeColor = "#388e3c";
                            }

                            return (
                                <div key={cat.id} className="category-percentage-item">
                                    <div className="category-percentage-left">
                                        <div className="category-name">{cat.categoryName}</div>
                                        {cat.description && (
                                            <div className="category-desc">{cat.description}</div>
                                        )}
                                        <span
                                            className="category-badge-pill"
                                            style={{ backgroundColor: badgeBg, color: badgeColor }}
                                        >
                                            {cat.applicableTo}
                                        </span>
                                    </div>

                                    <div className="category-percentage-right">
                                        <div className="input-percentage-wrapper">
                                            <input
                                                type="number"
                                                className="input-percentage-field"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={percentageInputs[cat.id] ?? ""}
                                                onChange={(e) =>
                                                    handlePercentageInputChange(cat.id, e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                            <span className="input-percentage-unit">%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="percentage-summary-bar">
                        <span>Total Percentage Allocated:</span>
                        <span
                            className={`total-percentage-badge ${
                                isTotal100 ? "valid" : "warning"
                            }`}
                        >
                            {totalPercentageSum.toFixed(1)}%
                        </span>
                    </div>

                    {!isTotal100 && (
                        <div className="percentage-warning-msg">
                            ⚠️ Total percentage must equal 100.0% to enable Submit (Current: {totalPercentageSum.toFixed(1)}%)
                        </div>
                    )}

                    <div className="percentage-modal-actions">
                        <Button
                            variant="secondary"
                            onClick={() => setIsPercentageModalOpen(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSavePercentages}
                            disabled={saving || !isTotal100}
                            style={{
                                backgroundColor: isTotal100 ? "#007bff" : "#94a3b8",
                                color: "white",
                                minWidth: "120px",
                                cursor: (saving || !isTotal100) ? "not-allowed" : "pointer",
                                opacity: isTotal100 ? 1 : 0.65
                            }}
                        >
                            {saving ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default AssessmentCategoryByType;
