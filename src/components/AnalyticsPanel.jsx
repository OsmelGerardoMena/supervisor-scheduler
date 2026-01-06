import React from 'react';

export const AnalyticsPanel = ({ scheduleData }) => {
    if (!scheduleData) return null;

    const { s1, s2, s3 } = scheduleData;
    const totalDays = s1.length;

    const calculateStats = (arr) => {
        const p = arr.filter(x => x === 'P').length;
        const d = arr.filter(x => x === 'D').length;
        const s = arr.filter(x => x === 'S').length;
        const i = arr.filter(x => x === 'I').length;
        const b = arr.filter(x => x === 'B').length;
        return { p, d, s, i, b, utilization: ((p / totalDays) * 100).toFixed(1) };
    };

    const stats1 = calculateStats(s1);
    const stats2 = calculateStats(s2);
    const stats3 = calculateStats(s3);

    // Fairness: Deviation from S1's drill time?
    // S2/S3 adjust, so they might work more or less.

    return (
        <div className="analytics-panel">
            <h3 className="analytics-header">Efficiency Dashboard</h3>

            <div className="stat-grid">
                <StatCard title="Supervisor 1 (Master)" stats={stats1} color="#2563eb" />
                <StatCard title="Supervisor 2 (Agent)" stats={stats2} color="#16a34a" />
                <StatCard title="Supervisor 3 (Agent)" stats={stats3} color="#db2777" />
            </div>

            <div className="analytics-note">
                <strong>Balance Note:</strong> Supervisor 1 maintains fixed regimen. S2 and S3 dynamically adjust rests to ensure continuous coverage.
                {(Math.abs(stats2.p - stats1.p) > 5 || Math.abs(stats3.p - stats1.p) > 5) &&
                    <span style={{ color: '#d97706' }}> Note: Significant workload deviation detected to cover gaps.</span>
                }
            </div>
        </div>
    );
};

const StatCard = ({ title, stats, color }) => (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
        <h4>{title}</h4>
        <div className="stat-row">
            <span>Days Drilling:</span>
            <strong>{stats.p}</strong>
        </div>
        <div className="stat-row">
            <span>Utilization:</span>
            <strong>{stats.utilization}%</strong>
        </div>
        <div className="stat-footer">
            <span>Rest: {stats.d}</span>
            <span>Travel/Ind: {stats.s + stats.b + stats.i}</span>
        </div>
    </div>
);
