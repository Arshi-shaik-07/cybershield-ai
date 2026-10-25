import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Crosshair, 
  ShieldAlert, 
  Zap, 
  Layers,
  Clock
} from 'lucide-react';

export default function AttackSimulator({
  scenarios,
  activeScenarioId,
  activeStepIndex,
  isRunning,
  onStartScenario,
  onPauseScenario,
  onResumeScenario,
  onResetScenario,
}) {
  const currentScenario = scenarios.find(s => s.id === activeScenarioId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Scenario Selection Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {scenarios.map((scenario) => {
          const isActive = activeScenarioId === scenario.id;

          return (
            <div
              key={scenario.id}
              className={`glass-panel ${isActive ? 'glass-panel-glow' : ''}`}
              style={{
                padding: 18,
                border: isActive ? '1px solid var(--cyber-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className={`cyber-badge ${scenario.severity === 'Critical' ? 'cyber-badge-crimson' : 'cyber-badge-amber'}`}>
                    {scenario.severity.toUpperCase()}
                  </span>
                  <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 10 }}>
                    {scenario.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 17, color: '#fff', marginBottom: 6 }}>
                  {scenario.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {scenario.description}
                </p>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>
                  <Crosshair size={13} />
                  <span>TARGET: {scenario.targetZone}</span>
                </div>
              </div>

              {/* Start / Pause / Status Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                {isActive ? (
                  <>
                    <button
                      onClick={isRunning ? onPauseScenario : onResumeScenario}
                      className="cyber-btn cyber-btn-primary"
                      style={{ flex: 1 }}
                    >
                      {isRunning ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isRunning ? 'Pause Attack' : 'Resume Attack'}</span>
                    </button>
                    <button
                      onClick={onResetScenario}
                      className="cyber-btn"
                      title="Reset Simulation"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onStartScenario(scenario.id)}
                    disabled={activeScenarioId !== null}
                    className="cyber-btn cyber-btn-primary"
                    style={{
                      width: '100%',
                      opacity: activeScenarioId !== null ? 0.4 : 1,
                      cursor: activeScenarioId !== null ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Play size={14} />
                    <span>Launch Attack Scenario</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Kill-Chain Execution Pipeline */}
      {currentScenario && (
        <div className="glass-panel" style={{ padding: 22, border: '1px solid var(--cyber-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="var(--cyber-cyan)" />
                <h3 style={{ fontSize: 18, color: '#fff' }}>
                  ACTIVE KILL-CHAIN: {currentScenario.name.toUpperCase()}
                </h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                AUTOMATED INTRUDER REPLAY ENGINE • MITRE ATT&CK RECONSTRUCTION
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 12, padding: '4px 10px' }}>
                STEP {activeStepIndex} OF {currentScenario.steps.length}
              </span>
            </div>
          </div>

          {/* Stepper Steps Timeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${currentScenario.steps.length}, 1fr)`,
            gap: 12,
            overflowX: 'auto',
          }}>
            {currentScenario.steps.map((step, idx) => {
              const isPast = activeStepIndex > step.stepIndex;
              const isCurrent = activeStepIndex === step.stepIndex;
              const isPending = activeStepIndex < step.stepIndex;

              return (
                <div
                  key={step.stepIndex}
                  style={{
                    background: isCurrent
                      ? 'rgba(0, 240, 255, 0.1)'
                      : isPast
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(8, 14, 28, 0.6)',
                    border: isCurrent
                      ? '1px solid var(--cyber-cyan)'
                      : isPast
                      ? '1px solid var(--cyber-emerald)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: 12,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="mono" style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isCurrent ? 'var(--cyber-cyan)' : isPast ? 'var(--cyber-emerald)' : 'var(--text-muted)'
                    }}>
                      PHASE 0{step.stepIndex}
                    </span>

                    {isPast && <CheckCircle2 size={14} color="var(--cyber-emerald)" />}
                    {isCurrent && (
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--cyber-crimson)',
                        animation: 'pulseAlert 1s infinite ease-in-out',
                      }} />
                    )}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                    {step.title.split(':')[0]}
                  </div>

                  <span className="cyber-badge" style={{ fontSize: 9, marginBottom: 8, display: 'inline-block' }}>
                    {step.technique.split(' ')[0]}
                  </span>

                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {step.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
