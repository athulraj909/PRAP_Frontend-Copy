const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getAssessmentHistory = async (studentMobile) => {
    const response = await fetch(`${API_BASE_URL}/student/exam/results/?mobile=${studentMobile}`);
    if (!response.ok) {
        throw new Error('Failed to fetch assessment history');
    }
    const data = await response.json();
    const results = data.results || [];
    return results.map((result) => ({
        id: result.id,
        studentName: result.student_name,
        studentMobile: result.student_mobile,
        college: result.college,
        course: result.course,
        totalQuestions: result.total_marks,
        totalScore: result.score,
        percentage: result.percentage,
        submittedAt: result.completed_at,
        categoryPerformance: result.category_breakdown || [],
        answers: result.answers || {},
        timeTaken: result.answers?.timeTaken || 0,
        reason: result.answers?.reason || "Submitted",
        review: result.answers?.review || [],
    }));
};

export const getAssessmentById = async (id, studentMobile) => {
    const history = await getAssessmentHistory(studentMobile);
    const result = history.find((item) => item.id === id);
    if (!result) {
        throw new Error('Assessment not found');
    }
    return result;
};

export default {
    getAssessmentHistory,
    getAssessmentById,
};
