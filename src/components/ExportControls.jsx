import React from 'react';

export const ExportControls = ({ scheduleData, config }) => {
    const downloadCSV = () => {
        if (!scheduleData) return;

        const { s1, s2, s3 } = scheduleData;
        const days = s1.length;

        // Header
        let csvContent = "";
        csvContent += "Day,Supervisor 1,Supervisor 2,Supervisor 3,Drilling (#P)\n";

        // Rows
        for (let i = 0; i < days; i++) {
            const pCount = [s1[i], s2[i], s3[i]].filter(s => s === 'P').length;
            csvContent += `${i + 1},${s1[i]},${s2[i]},${s3[i]},${pCount}\n`;
        }

        // BOM for Excel compatibility (essential for UTF-8)
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        // Robust filename generation
        const safeDays = (config && config.totalDays) ? config.totalDays : days;
        const fileName = `supervisor_schedule_${safeDays}d.csv`;

        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Delay removal to ensure browser captures event
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    };

    const printSchedule = () => {
        window.print();
    };

    return (
        <div className="export-controls">
            <button onClick={downloadCSV} className="btn-secondary">
                Export CSV
            </button>
        </div>
    );
};
