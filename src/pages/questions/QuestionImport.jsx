import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

import Button from "../../components/common/Button";
import questionService from "../../services/questionService";

function QuestionImport({
    categories = [],
    onSuccess,
    onCancel,
}) {

    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseExcelFile(selectedFile);
        }
    };

    const parseExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                if (jsonData.length < 2) {
                    toast.error("Excel file is empty or has no data");
                    return;
                }

                // Skip header row and map data
                const questions = jsonData.slice(1).map((row, index) => ({
                    category: row[0] || "",
                    question: row[1] || "",
                    optionA: row[2] || "",
                    optionB: row[3] || "",
                    optionC: row[4] || "",
                    optionD: row[5] || "",
                    correctAnswer: row[6] || "A",
                    explanation: row[7] || "",
                    marks: row[8] || 1,
                    negativeMarks: row[9] || 0,
                    status: "Active",
                })).filter(q => q.category && q.question);

                setPreviewData(questions);
                toast.success(`Parsed ${questions.length} questions from Excel`);
            } catch (error) {
                toast.error("Error parsing Excel file");
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        if (previewData.length === 0) {
            toast.error("No questions to import");
            return;
        }

        setLoading(true);
        try {
            const result = await questionService.addQuestionsBatch(previewData);
            
            if (result.errors && result.errors.length > 0) {
                toast.warning(`Imported ${result.created} questions with ${result.errors.length} errors`);
                console.error("Import errors:", result.errors);
            } else {
                toast.success(result.message || `Successfully imported ${result.created} questions`);
            }
            
            if (result.created_categories && result.created_categories.length > 0) {
                toast.info(`Created ${result.created_categories.length} new categories: ${result.created_categories.join(', ')}`);
            }
            
            if (result.created > 0) {
                onSuccess();
            }
        } catch (error) {
            toast.error(error.message || "Error importing questions");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            ["Category", "Question", "Option A", "Option B", "Option C", "Option D", "Correct Answer", "Explanation", "Marks", "Negative Marks"],
            ["Quantitative Aptitude", "Sample question here", "Option A", "Option B", "Option C", "Option D", "A", "Explanation here", 1, 0],
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Questions");
        XLSX.writeFile(wb, "question_template.xlsx");
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>Import Questions from Excel</h3>
                <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "14px" }}>
                    Upload an Excel file with questions. The file should have columns in this order:
                    Category, Question, Option A, Option B, Option C, Option D, Correct Answer, Explanation, Marks, Negative Marks
                </p>
                
                <Button
                    variant="secondary"
                    onClick={downloadTemplate}
                    style={{ marginBottom: "16px" }}
                >
                    Download Template
                </Button>

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px dashed var(--gray-300)",
                        borderRadius: "8px",
                        background: "var(--gray-50)",
                    }}
                />
            </div>

            {previewData.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ margin: "0 0 10px 0" }}>
                        Preview ({previewData.length} questions)
                    </h4>
                    <div
                        style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            border: "1px solid var(--gray-300)",
                            borderRadius: "8px",
                        }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead style={{ position: "sticky", top: 0, background: "var(--gray-100)" }}>
                                <tr>
                                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid var(--gray-300)" }}>#</th>
                                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid var(--gray-300)" }}>Category</th>
                                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid var(--gray-300)" }}>Question</th>
                                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid var(--gray-300)" }}>Correct</th>
                                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid var(--gray-300)" }}>Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((q, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--gray-200)" }}>{index + 1}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--gray-200)" }}>{q.category}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--gray-200)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.question}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--gray-200)" }}>{q.correctAnswer}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--gray-200)" }}>{q.marks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleImport}
                    disabled={loading || previewData.length === 0}
                >
                    {loading ? "Importing..." : `Import ${previewData.length} Questions`}
                </Button>
            </div>
        </div>
    );
}

export default QuestionImport;
