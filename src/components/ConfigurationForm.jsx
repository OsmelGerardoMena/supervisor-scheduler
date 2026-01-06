import { useState } from 'react';

export const ConfigurationForm = ({ onCalculate, initialValues = {} }) => {
    const [formData, setFormData] = useState({
        workDays: initialValues.workDays || 14,
        restDays: initialValues.restDays || 7,
        inductionDays: initialValues.inductionDays || 5,
        totalDays: initialValues.totalDays || 30
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: parseInt(value) || 0 };

            // Clear error if resolved
            if (next.workDays <= next.totalDays) {
                setError(null);
            }
            return next;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Senior Validation: Logic Guard
        if (formData.workDays > formData.totalDays) {
            setError(`Logic Error: Work days (${formData.workDays}) cannot exceed simulation duration (${formData.totalDays}).`);
            return;
        }

        onCalculate(formData);
    };

    return (
        <form className="config-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Work Days (N)</label>
                <input
                    type="number"
                    name="workDays"
                    className="form-input"
                    value={formData.workDays}
                    onChange={handleChange}
                    min="1"
                />
            </div>

            <div className="form-group">
                <label>Rest Days (M)</label>
                <input
                    type="number"
                    name="restDays"
                    className="form-input"
                    value={formData.restDays}
                    onChange={handleChange}
                    min="2"
                />
            </div>

            <div className="form-group">
                <label>Induction Days (I)</label>
                <input
                    type="number"
                    name="inductionDays"
                    className="form-input"
                    value={formData.inductionDays}
                    onChange={handleChange}
                    min="0"
                    max={formData.workDays - 2}
                />
            </div>

            <div className="form-group">
                <label>Total Days</label>
                <input
                    type="number"
                    name="totalDays"
                    className="form-input"
                    value={formData.totalDays}
                    onChange={handleChange}
                    min="15"
                    max="2000"
                />
            </div>

            <button type="submit" className="btn-primary" disabled={!!error}>
                CALCULATE SCHEDULE
            </button>

            {error && (
                <div className="form-error">
                    ⚠️ {error}
                </div>
            )}
        </form>
    );
}
