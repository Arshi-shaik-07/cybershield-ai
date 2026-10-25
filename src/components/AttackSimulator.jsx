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
  Clock,
  BellRing
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

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

  const handleTestSolidSound = () => {
    soundFX.playAlarmAlert();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner with Alert Sound Tester */}
      <div className="glass-panel" style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        border: '1px solid #bae6fd',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BellRing size={20} color="#0284c7" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              HIGH-IMPACT CYBER INTRUSION ALARM ACTIVE
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Upgraded solid dual-oscillator klaxon with sub-bass punch & dual-pulse transient.
            </div>
          </div>
        </div>

        <button
          onClick={handleTestSolidSound}
          className="cyber-btn cyber-btn-sm"
          style={{
            borderColor: '#fca5a5',
            background: '#fef2f2',
            color: '#dc2626',
            fontWeight: 700,
          }}
          title="Play solid intrusion alert sound"
        >
          <BellRing size={14} />
          <span>Test Solid Alert Sound</span>
        </button>
      </div>

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
                border: isActive ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
                background: '#ffffff',
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

                <h3 style={{ fontSize: 17, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {scenario.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {scenario.description}
                </p>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#0284c7', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
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
        <div className="glass-panel" style={{ padding: 22, border: '2px solid #0284c7', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="#0284c7" />
                <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>
                  ACTIVE KILL-CHAIN: {currentScenario.name.toUpperCase()}
                </h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                AUTOMATED INTRUDER REPLAY ENGINE • DYNAMIC MITRE ATT&CK TELEMETRY
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
            {currentScenario.steps.map((step) => {
              const isPast = activeStepIndex > step.stepIndex;
              const isCurrent = activeStepIndex === step.stepIndex;

              return (
                <div
                  key={step.stepIndex}
                  style={{
                    background: isCurrent
                      ? '#f0f9ff'
                      : isPast
                      ? '#ecfdf5'
                      : '#f8fafc',
                    border: isCurrent
                      ? '2px solid #0284c7'
                      : isPast
                      ? '1px solid #059669'
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
                      color: isCurrent ? '#0284c7' : isPast ? '#059669' : 'var(--text-muted)'
                    }}>
                      PHASE 0{step.stepIndex}
                    </span>

                    {isPast && <CheckCircle2 size={14} color="#059669" />}
                    {isCurrent && (
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#dc2626',
                        animation: 'pulseAlertLight 1s infinite ease-in-out',
                      }} />
                    )}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
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
