import { useState, useEffect } from 'react'
import { Scheduler } from './logic/Scheduler'
import { ConfigurationForm } from './components/ConfigurationForm'
import { ScheduleGrid } from './components/ScheduleGrid'
import { ExportControls } from './components/ExportControls'
import { AnalyticsPanel } from './components/AnalyticsPanel'

function App() {
  const [scheduleData, setScheduleData] = useState(null);
  const [config, setConfig] = useState(null);

  // Load configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('scheduler_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        handleCalculate(parsed);
      } catch (e) {
        console.error("Config load error", e);
      }
    }
  }, []);

  const handleCalculate = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('scheduler_config', JSON.stringify(newConfig));

    const scheduler = new Scheduler(newConfig);
    const result = scheduler.generate();
    setScheduleData(result);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Supervisor Shift Scheduler</h1>
        <p className="app-subtitle">Crew Optimization Algorithm (Rule: 2 Drilling)</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/technical_report.html" target="_blank" className="tech-report-link">
            📄 View Technical Report
          </a>
        </div>
      </header>

      <main className="app-main">
        <ConfigurationForm onCalculate={handleCalculate} initialValues={JSON.parse(localStorage.getItem('scheduler_config') || '{}')} />

        {scheduleData && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
              <h2 style={{ margin: 0 }}>Generated Schedule</h2>
              <ExportControls scheduleData={scheduleData} config={config} />
            </div>

            <ScheduleGrid data={scheduleData} />

            <AnalyticsPanel scheduleData={scheduleData} />
          </div>
        )}

        {!scheduleData && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
            <p>Enter parameters and calculate schedule to begin.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
