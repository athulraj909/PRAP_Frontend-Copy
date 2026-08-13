import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";

import examSettingsService from "../../services/examSettingsService";

import "./Settings.css";

function Settings() {
    const [settings, setSettings] = useState({
        question_count: 100,
        exam_duration_minutes: 100,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await examSettingsService.getExamSettings();
            setSettings({
                question_count: data.question_count,
                exam_duration_minutes: data.exam_duration_minutes,
            });
        } catch (error) {
            console.error("Failed to load settings:", error);
            toast.error("Failed to load exam settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await examSettingsService.updateExamSettings(settings);
            toast.success("Exam settings updated successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Failed to update exam settings");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings({
            question_count: 100,
            exam_duration_minutes: 100,
        });
        toast.info("Settings reset to defaults");
    };

    if (loading) {
        return (
            <div className="settings-page">
                <div className="page-container">
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-page">
            <div className="page-container">
                <div className="page-header">
                    <h1>Exam Settings</h1>
                    <p>Configure exam parameters for students</p>
                </div>

                <Card>
                    <div className="settings-form">
                        <div className="form-group">
                            <label htmlFor="question_count">
                                Number of Questions
                            </label>
                            <Input
                                id="question_count"
                                type="number"
                                min="1"
                                max="200"
                                value={settings.question_count}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    question_count: parseInt(e.target.value) || 0
                                })}
                                placeholder="Enter number of questions"
                            />
                            <small className="help-text">
                                Total questions that will be loaded for each student exam
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exam_duration_minutes">
                                Exam Duration (minutes)
                            </label>
                            <Input
                                id="exam_duration_minutes"
                                type="number"
                                min="1"
                                max="300"
                                value={settings.exam_duration_minutes}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    exam_duration_minutes: parseInt(e.target.value) || 0
                                })}
                                placeholder="Enter exam duration in minutes"
                            />
                            <small className="help-text">
                                Total time allowed for completing the exam
                            </small>
                        </div>

                        <div className="settings-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleReset}
                                disabled={saving}
                            >
                                Reset to Defaults
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Settings"}
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="info-card">
                    <h3>Important Notes</h3>
                    <ul>
                        <li>Changes to these settings will apply to all new exam sessions</li>
                        <li>Currently active exams will continue with their original settings</li>
                        <li>Question count cannot exceed the total available questions in the database</li>
                        <li>Duration is set in minutes (e.g., 60 = 1 hour, 100 = 1 hour 40 minutes)</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export default Settings;
