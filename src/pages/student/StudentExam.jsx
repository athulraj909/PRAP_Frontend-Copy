import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";
import questionService from "../../services/questionService";
import assessmentCategoryService from "../../services/assessmentCategoryService";
import { submitExam } from "../../services/studentService";
import { getApplicableCategoriesForCourse } from "../../utils/courseClassification";

import "./StudentExam.css";

const EXAM_DURATION_SECONDS = 100 * 60;
const MAX_WARNING_COUNT = 3;
const MAX_QUESTIONS_PER_EXAM = 100;

const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const buildRandomExamQuestions = (questions, maxCount) => {
    const categoryGroups = questions.reduce((groups, question) => {
        if (!groups[question.categoryName]) {
            groups[question.categoryName] = [];
        }
        groups[question.categoryName].push(question);
        return groups;
    }, {});

    const selected = [];
    const chosenIds = new Set();

    Object.values(categoryGroups).forEach((group) => {
        const shuffled = shuffleArray(group);
        if (shuffled.length > 0) {
            selected.push(shuffled[0]);
            chosenIds.add(shuffled[0].id);
        }
    });

    const remaining = shuffleArray(questions.filter((question) => !chosenIds.has(question.id)));
    while (selected.length < maxCount && remaining.length > 0) {
        selected.push(remaining.shift());
    }

    return shuffleArray(selected.slice(0, maxCount));
};

function StudentExam() {
    const navigate = useNavigate();

    const [studentSession, setStudentSession] = useState(null);
    const [studentMobile, setStudentMobile] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [warningCount, setWarningCount] = useState(0);

    const warningCountRef = useRef(0);
    const questionCardRef = useRef(null);
    const answersRef = useRef(answers);
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        const session = localStorage.getItem("studentSession");
        if (!session) {
            navigate("/");
            return;
        }

        try {
            const student = JSON.parse(session);
            if (!student || !student.mobile) {
                throw new Error("Invalid student session");
            }
            setStudentSession(student);
            setStudentMobile(student.mobile);
        } catch (error) {
            console.error("Error parsing student session:", error);
            navigate("/");
            return;
        }
    }, [navigate]);

    useEffect(() => {
        if (!studentSession) {
            return;
        }

        const loadQuestions = async () => {
            try {
                const allQuestions = await questionService.getQuestions();
                const activeQuestions = allQuestions.filter((question) => question.status === "Active");

                // Get applicable categories based on student's course
                const studentCourse = studentSession?.course || "";
                const applicableCategories = getApplicableCategoriesForCourse(studentCourse);

                // Get category names for the applicable types
                const categories = await assessmentCategoryService.getAssessmentCategories();
                const applicableCategoryNames = categories
                    .filter(cat => applicableCategories.includes(cat.applicableTo))
                    .map(cat => cat.categoryName);

                // Filter questions by applicable categories
                const filteredQuestions = activeQuestions.filter(question => 
                    applicableCategoryNames.includes(question.categoryName)
                );

                if (filteredQuestions.length === 0) {
                    toast.error("No questions available for your course category.");
                    navigate("/student-dashboard");
                    return;
                }

                const selectedQuestions = buildRandomExamQuestions(filteredQuestions, Math.min(MAX_QUESTIONS_PER_EXAM, filteredQuestions.length));

                if (!selectedQuestions.length) {
                    toast.error("No active questions are available for the exam right now.");
                    navigate("/student-dashboard");
                    return;
                }

                const initialAnswers = {};
                selectedQuestions.forEach((question) => {
                    initialAnswers[question.id] = null;
                });

                const draftKey = studentMobile ? `examDraft_${studentMobile}` : null;
                const savedDraft = draftKey ? localStorage.getItem(draftKey) : null;
                if (savedDraft) {
                    try {
                        const draft = JSON.parse(savedDraft);
                        setAnswers({ ...initialAnswers, ...draft.answers });
                        if (typeof draft.currentIndex === "number" && draft.currentIndex >= 0 && draft.currentIndex < selectedQuestions.length) {
                            setCurrentIndex(draft.currentIndex);
                        }
                    } catch (draftError) {
                        console.warn("Unable to restore exam draft:", draftError);
                        setAnswers(initialAnswers);
                    }
                } else {
                    setAnswers(initialAnswers);
                }

                setQuestions(selectedQuestions);
            } catch (error) {
                console.error("Failed to load exam questions:", error);
                toast.error(error.message || "Unable to load the assessment questions.");
                navigate("/student-dashboard");
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [navigate, studentSession, studentMobile]);

    useEffect(() => {
        if (!loading && !questions.length) {
            toast.error("Unable to start the exam because no questions could be loaded.");
            navigate("/student-dashboard");
        }
    }, [loading, navigate, questions.length]);

    useEffect(() => {
        if (questions.length && currentIndex >= questions.length) {
            setCurrentIndex(0);
        }
    }, [questions.length, currentIndex]);

    const handleSubmitExam = useCallback(async (reason = "Submitted by student") => {
        if (submitting || !questions.length) {
            return;
        }

        setSubmitting(true);

        const currentAnswers = answersRef.current;
        const currentTimeLeft = timeLeftRef.current;

        const score = questions.reduce((acc, question) => {
            const studentAnswer = currentAnswers[question.id];
            if (!studentAnswer) {
                return acc;
            }

            // Normalize student answer: extract letter from "optionA" -> "A"
            const studentAnswerLetter = studentAnswer.replace("option", "").toUpperCase();

            // Normalize correct answer: handle both "A" and "optionA" formats
            const rawCorrect = question.correctAnswer;
            const correctAnswerLetter = (typeof rawCorrect === "string" && rawCorrect.startsWith("option"))
                ? rawCorrect.replace("option", "").toUpperCase()
                : String(rawCorrect).toUpperCase();

            if (studentAnswerLetter === correctAnswerLetter) {
                return acc + (question.marks || 1);
            }

            // Apply negative marks if configured
            if (question.negativeMarks && question.negativeMarks > 0) {
                return acc - question.negativeMarks;
            }

            return acc;
        }, 0);

        const answeredCount = Object.values(currentAnswers).filter(Boolean).length;
        const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
        const timeTaken = EXAM_DURATION_SECONDS - Math.max(currentTimeLeft, 0);

        const categoryStats = questions.reduce((stats, question) => {
            const category = question.categoryName || "General";
            if (!stats[category]) {
                stats[category] = {
                    category,
                    total: 0,
                    correct: 0,
                };
            }
            stats[category].total += 1;

            const studentAnswer = currentAnswers[question.id];
            if (studentAnswer) {
                const studentAnswerLetter = studentAnswer.replace("option", "").toUpperCase();
                const rawCorrect = question.correctAnswer;
                const correctAnswerLetter = (typeof rawCorrect === "string" && rawCorrect.startsWith("option"))
                    ? rawCorrect.replace("option", "").toUpperCase()
                    : String(rawCorrect).toUpperCase();

                if (studentAnswerLetter === correctAnswerLetter) {
                    stats[category].correct += 1;
                }
            }
            return stats;
        }, {});

        const categoryPerformance = Object.values(categoryStats).map((stat) => ({
            ...stat,
            percentage: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
        }));

        const review = questions.map((question) => {
            const selectedKey = currentAnswers[question.id] || null;
            const selectedLabel = selectedKey ? question[selectedKey] : null;

            // Normalize correct answer key: questions may store "B" or "optionB"
            const rawCorrect = question.correctAnswer;
            const correctKey = (typeof rawCorrect === "string" && rawCorrect.startsWith("option"))
                ? rawCorrect
                : `option${String(rawCorrect).toUpperCase()}`;

            const correctLabel = question[correctKey] || null;

            // Normalize both answers to just the letter for comparison
            const studentAnswerLetter = selectedKey ? selectedKey.replace("option", "").toUpperCase() : null;
            const correctAnswerLetter = correctKey.replace("option", "").toUpperCase();
            const isCorrect = studentAnswerLetter === correctAnswerLetter;

            return {
                id: question.id,
                category: question.categoryName || "General",
                question: question.question,
                options: {
                    optionA: question.optionA,
                    optionB: question.optionB,
                    optionC: question.optionC,
                    optionD: question.optionD,
                },
                selectedKey,
                selectedLabel,
                correctKey,
                correctLabel,
                isCorrect,
                explanation: question.explanation || "No explanation available.",
            };
        });

        const examPayload = {
            student: studentSession,
            answers: currentAnswers,
            totalQuestions: questions.length,
            score,
            percentage,
            timeTaken,
            categoryPerformance,
            review,
            reason,
        };

        try {
            // Submit to backend
            await submitExam(examPayload);

            // Also save to localStorage for result page
            const draftOwnerKey = studentMobile || studentSession?.mobile || "student";
            const resultKey = `examResult_${draftOwnerKey}`;
            localStorage.setItem(resultKey, JSON.stringify({
                student: studentSession,
                submittedAt: new Date().toISOString(),
                reason,
                totalQuestions: questions.length,
                score,
                answeredCount,
                percentage,
                timeTaken,
                categoryPerformance,
                review,
            }));

            // Save simplified performance data to assessment history
const draftKey = studentMobile ? `examDraft_${studentMobile}` : (studentSession?.mobile ? `examDraft_${studentSession.mobile}` : null);
            if (draftKey) {
                localStorage.removeItem(draftKey);
            }

            toast.success("Assessment submitted successfully.");
            navigate("/student-exam-result");
        } catch (error) {
            console.error("Failed to submit exam:", error);
            toast.error("Failed to submit exam. Please try again.");
            setSubmitting(false);
        }
    }, [questions, studentMobile, studentSession, submitting, navigate]);

    useEffect(() => {
        if (!questions.length || submitting) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitExam("Time completed");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [questions.length, submitting, handleSubmitExam]);

    useEffect(() => {
        if (!questions.length || submitting) {
            return;
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const nextWarningCount = warningCountRef.current + 1;
                warningCountRef.current = nextWarningCount;
                setWarningCount(nextWarningCount);

                if (nextWarningCount >= MAX_WARNING_COUNT) {
                    toast.error("You switched tabs/screens too many times. The assessment has been auto-submitted.");
                    handleSubmitExam("Tab or screen change limit exceeded");
                    return;
                }

                toast.warn(`Warning: You left the exam window (${nextWarningCount}/${MAX_WARNING_COUNT}).`);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [questions.length, submitting, handleSubmitExam]);

    const currentQuestion = questions[currentIndex];

    const answeredCount = useMemo(() => {
        return Object.values(answers).filter((answer) => Boolean(answer)).length;
    }, [answers]);

    const progressPercent = questions.length ? (answeredCount / questions.length) * 100 : 0;

    const handleOptionSelect = useCallback((option) => {
        if (!currentQuestion) {
            return;
        }

        setAnswers((prev) => {
            const nextAnswers = {
                ...prev,
                [currentQuestion.id]: option,
            };
            const draftKey = studentMobile ? `examDraft_${studentMobile}` : null;
            if (draftKey) {
                localStorage.setItem(draftKey, JSON.stringify({
                    answers: nextAnswers,
                    currentIndex,
                    updatedAt: new Date().toISOString(),
                }));
            }
            return nextAnswers;
        });
    }, [currentQuestion, currentIndex, studentMobile]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const scrollQuestionIntoView = () => {
        if (questionCardRef.current) {
            questionCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const hasLoadedRef = useRef(false);

    useEffect(() => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            return;
        }
        scrollQuestionIntoView();
    }, [currentIndex]);

    const handleJumpToQuestion = (index) => {
        setCurrentIndex(index);
    };

    const formatTime = (value) => {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="student-exam-page">
                <div className="student-exam-loading">
                    <h2>Preparing your assessment...</h2>
                    <p>Please wait while the exam loads.</p>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="student-exam-page">
                <div className="student-exam-loading">
                    <h2>Exam could not be loaded</h2>
                    <p>If the assessment does not start automatically, please return to the dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-exam-page">
            <div className="student-exam-shell">
                <header className="student-exam-header">
                    <div>
                        <p className="exam-badge">LIVE ASSESSMENT</p>
                        <h1>Placement Readiness Assessment</h1>
                        <p>Answer one question at a time. The timer will auto-submit the exam when it ends.</p>
                    </div>
                    <div className="exam-timer-card">
                        <span className="timer-label">Time Left</span>
                        <strong>{formatTime(timeLeft)}</strong>
                    </div>
                </header>

                <section className="exam-progress-card">
                    <div className="progress-meta">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>{answeredCount}/{questions.length} answered</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                </section>

                <section className="exam-layout">
                    <div className="exam-main">
                        <section className="exam-question-card" ref={questionCardRef}>
                            <div className="question-card-header">
                                <span className="question-category">{currentQuestion.categoryName}</span>
                                <span className="question-mark">1 mark</span>
                            </div>
                            <h2>{currentQuestion.question}</h2>
                            <div className="options-grid">
                                {[
                                    { key: "optionA", label: currentQuestion.optionA },
                                    { key: "optionB", label: currentQuestion.optionB },
                                    { key: "optionC", label: currentQuestion.optionC },
                                    { key: "optionD", label: currentQuestion.optionD },
                                ].map((option) => {
                                    const isSelected = answers[currentQuestion.id] === option.key;
                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            className={`option-btn ${isSelected ? "selected" : ""}`}
                                            onClick={() => handleOptionSelect(option.key)}
                                        >
                                            <span className="option-letter">{option.key.replace("option", "")}</span>
                                            <span>{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="exam-actions">
                            <Button type="button" variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
                                Prev
                            </Button>
                            <Button type="button" variant="tertiary" onClick={() => handleSubmitExam("Submitted by student")}> 
                                Submit Exam
                            </Button>
                            {currentIndex < questions.length - 1 ? (
                                <Button type="button" variant="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="button" variant="primary" onClick={() => handleSubmitExam("Submitted by student")}>
                                    Submit
                                </Button>
                            )}
                        </section>
                        {warningCount > 0 && (
                            <div className="warning-box">
                                <strong>Warning status:</strong> {warningCount}/{MAX_WARNING_COUNT} tab or screen changes detected.
                            </div>
                        )}
                    </div>

                    <aside className="exam-sidebar">
                        <div className="sidebar-card">
                            <h3>Question Palette</h3>
                            <div className="palette-grid">
                                {questions.map((question, index) => {
                                    const isAnswered = Boolean(answers[question.id]);
                                    return (
                                        <button
                                            key={question.id}
                                            type="button"
                                            className={`palette-item ${currentIndex === index ? "active" : ""} ${isAnswered ? "answered" : "not-visited"}`}
                                            onClick={() => handleJumpToQuestion(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="palette-legend">
                                <div><span className="legend-dot answered" /> Answered</div>
                                <div><span className="legend-dot not-visited" /> Not visited</div>
                            </div>
                        </div>
                    </aside>
                </section>

                <div className="warning-box">
                    <strong>Warning status:</strong> {warningCount}/{MAX_WARNING_COUNT} tab or screen changes detected.
                </div>
            </div>
        </div>
    );
}

export default StudentExam;
