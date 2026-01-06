import React from 'react';
import { STATUS } from '../logic/Scheduler';

export function ScheduleGrid({ data }) {
    if (!data) return null;

    const { s1, s2, s3, errors } = data;
    const days = s1.map((_, i) => i);

    // Calculate P count per day
    const pCounts = days.map(i => {
        let count = 0;
        if (s1[i] === STATUS.P) count++;
        if (s2[i] === STATUS.P) count++;
        if (s3[i] === STATUS.P) count++;
        return count;
    });

    // Calculate S3 Active Start (for validaiton logic display)
    const s3StartIndex = s3.findIndex(s => s === STATUS.S);

    return (
        <div className="schedule-container">
            <div className="legend">
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--color-subida)' }}></div> Travel In (S)</div>
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--color-induccion)' }}></div> Induction (I)</div>
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--color-perforacion)' }}></div> Drilling (P)</div>
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--color-bajada)' }}></div> Travel Out (B)</div>
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--color-descanso)' }}></div> Rest (D)</div>
            </div>

            <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px', position: 'sticky', left: 0, zIndex: 10, background: '#f1f5f9' }}>Sup</th>
                            {days.map(d => (
                                <th key={d} className={pCounts[d] !== 2 && d >= s3StartIndex ? 'count-error' : ''}>
                                    {d}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <Row label="S1" data={s1} />
                        <Row label="S2" data={s2} />
                        <Row label="S3" data={s3} />

                        <tr className="count-row">
                            <td style={{ position: 'sticky', left: 0, background: '#fff', fontWeight: 'bold' }}>#P</td>
                            {pCounts.map((count, i) => (
                                <td key={i} className={count !== 2 && i >= s3StartIndex ? 'count-error' : ''} style={{
                                    color: count === 2 ? 'green' : (i >= s3StartIndex ? 'red' : 'orange')
                                }}>
                                    {count}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {errors.length > 0 && (
                <div className="error-summary">
                    <h3>Errors Detected ({errors.length})</h3>
                    {errors.slice(0, 5).map((err, i) => (
                        <div key={i} className="error-item">
                            Day {err.day}: {err.msg}
                        </div>
                    ))}
                    {errors.length > 5 && <div>... and {errors.length - 5} more.</div>}
                </div>
            )}
        </div>
    );
}

function Row({ label, data }) {
    return (
        <tr>
            <td style={{ position: 'sticky', left: 0, background: '#fff', fontWeight: '600' }}>{label}</td>
            {data.map((status, i) => (
                <td key={i} className={`cell-${status || 'empty'}`}>
                    {status || '-'}
                </td>
            ))}
        </tr>
    );
}
