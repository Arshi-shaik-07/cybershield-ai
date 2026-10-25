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
  BellRing,
  Bot,
  Radio,
  Flame,
  Activity,
  ArrowRight
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
  autonomousMode = true,
  onToggleAutonomous,
  detectionSpeed = 7000,
  onChangeSpeed,
  autoDetectedCount = 0,
  lastAutoDetection = null,
  recentAutoIntrusions = [],
  autoCycleScenarios = false,
  onToggleAutoCycle,
}) {
  const currentScenario = scenarios.find(s => s.id === activeScenarioId);

  const handleTestSolidSound = () => {
    soundFX.playAlarmAlert();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. AUTONOMOUS FRAUD IDENTIFICATION ENGINE PANEL */}
      <div className="glass-panel" style={{
        padding: 24,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '2px solid #86efac',
        boxShadow: '0 4px 20px rgba(5, 150, 105, 0.08)',
      }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          borderBottom: '1px solid #bbf7d0',
          paddingBottom: 16,
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#dcfce7',
              border: '2px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(34, 197, 94, 0.3)',
            }}>
              <Bot size={24} color="#15803d" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 18, color: '#0f172a', fontWeight: 800 }}>
                  AUTONOMOUS FRAUD & INTRUSION DETECTION ENGINE
                </h3>
                <span className={`cyber-badge ${autonomousMode ? 'cyber-badge-emerald' : 'cyber-badge'}`} style={{ fontWeight: 700 }}>
                  {autonomousMode ? '🟢 LIVE AUTO-PILOT: ACTIVE' : '⏸ AUTO-PILOT: PAUSED'}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#166534', marginTop: 2, fontWeight: 500 }}>
                <strong>No button presses required:</strong> The system automatically hunts, detects, alerts, and seals fraud onto the blockchain in the background.
              </p>
            </div>
          </div>

          {/* Autonomous Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Speed / Cadence Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#ffffff', padding: '3px 6px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, padding: '0 4px' }}>SPEED:</span>
              <button
                onClick={() => onChangeSpeed && onChangeSpeed(5000)}
                style={{
                  border: 'none',
                  background: detectionSpeed <= 5000 ? '#059669' : 'transparent',
                  color: detectionSpeed <= 5000 ? '#ffffff' : '#475569',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Fast (5s)
              </button>
              <button
                onClick={() => onChangeSpeed && onChangeSpeed(8000)}
                style={{
                  border: 'none',
                  background: detectionSpeed > 5000 && detectionSpeed <= 9000 ? '#059669' : 'transparent',
                  color: detectionSpeed > 5000 && detectionSpeed <= 9000 ? '#ffffff' : '#475569',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Normal (8s)
              </button>
              <button
                onClick={() => onChangeSpeed && onChangeSpeed(14000)}
                style={{
                  border: 'none',
                  background: detectionSpeed > 9000 ? '#059669' : 'transparent',
                  color: detectionSpeed > 9000 ? '#ffffff' : '#475569',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Relaxed (14s)
              </button>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={onToggleAutonomous}
              className={`cyber-btn cyber-btn-sm ${autonomousMode ? '' : 'cyber-btn-primary'}`}
              style={{
                borderColor: autonomousMode ? '#cbd5e1' : '#059669',
                background: autonomousMode ? '#ffffff' : '#059669',
                color: autonomousMode ? '#0f172a' : '#ffffff',
              }}
            >
              {autonomousMode ? <Pause size={13} /> : <Play size={13} />}
              <span>{autonomousMode ? 'Pause Auto-Detection' : 'Resume Auto-Detection'}</span>
            </button>

            {/* Test Alarm Sound */}
            <button
              onClick={handleTestSolidSound}
              className="cyber-btn cyber-btn-sm"
              style={{ borderColor: '#fca5a5', background: '#fef2f2', color: '#dc2626' }}
              title="Test solid klaxon intrusion alarm"
            >
              <BellRing size={13} />
              <span>Test Alarm</span>
            </button>
          </div>
        </div>

        {/* Real-Time Live Autonomous Telemetry Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 16,
        }}>
          <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>AUTONOMOUS THREATS CAUGHT</span>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {autoDetectedCount} Intrusions
            </div>
            <p style={{ fontSize: 10, color: '#059669', marginTop: 2, fontWeight: 600 }}>
              DETECTED WITHOUT MANUAL INPUT
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>LAST DETECTED ADVERSARY</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', marginTop: 8 }}>
              {lastAutoDetection ? lastAutoDetection.attackerIp : '194.26.29.112 (Probing)'}
            </div>
            <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
              {lastAutoDetection ? lastAutoDetection.tactic : 'MITRE T1083 / Port 2222'}
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>AUTONOMOUS MITIGATION</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', marginTop: 8 }}>
              Auto-Quarantine & Blockchain
            </div>
            <p style={{ fontSize: 10, color: '#059669', marginTop: 2, fontWeight: 600 }}>
              ZERO MANUAL LATENCY • 110ms
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>SENSOR COVERAGE</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0284c7', marginTop: 8 }}>
              6 Subnets Monitored
            </div>
            <p style={{ fontSize: 10, color: '#0284c7', marginTop: 2, fontWeight: 600 }}>
              100% SENSORS ACTIVE 24/7
            </p>
          </div>
        </div>

        {/* Live Auto-Detection Feed Ticker */}
        {recentAutoIntrusions && recentAutoIntrusions.length > 0 && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={13} color="#059669" />
                LIVE AUTONOMOUS FRAUD IDENTIFICATION FEED
              </span>
              <span style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>
                ● STREAMING LIVE FROM DECEPTION SENSORS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentAutoIntrusions.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: '#f8fafc',
                    borderRadius: 6,
                    fontSize: 11,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ color: '#059669', fontWeight: 700 }}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {item.title}
                    </span>
                    <span className="cyber-badge" style={{ fontSize: 9 }}>
                      {item.tactic}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mono" style={{ color: '#dc2626', fontWeight: 600 }}>
                      IP: {item.attackerIp}
                    </span>
                    <span className="cyber-badge cyber-badge-purple" style={{ fontSize: 9 }}>
                      BLOCK #{item.blockNumber || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. MULTI-STAGE APT KILL-CHAIN ATTACK SIMULATIONS */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 14,
          padding: '14px 18px',
          background: autoCycleScenarios ? '#eff6ff' : '#f8fafc',
          border: autoCycleScenarios ? '2px solid #38bdf8' : '1px solid #cbd5e1',
          borderRadius: 8,
          boxShadow: autoCycleScenarios ? '0 2px 12px rgba(2, 132, 199, 0.12)' : 'none',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={18} color="#0284c7" />
              <h4 style={{ fontSize: 16, color: '#0f172a', fontWeight: 800, margin: 0 }}>
                MULTI-STAGE APT KILL-CHAIN ATTACK SUITE
              </h4>
              <span className={`cyber-badge ${autoCycleScenarios ? 'cyber-badge-cyan' : 'cyber-badge'}`} style={{ fontSize: 11, fontWeight: 700 }}>
                {autoCycleScenarios ? '🔄 CONTINUOUS AUTO-CYCLE: ACTIVE' : 'MANUAL SELECTION'}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#334155', margin: '4px 0 0 0', fontWeight: 500 }}>
              {autoCycleScenarios
                ? 'System is autonomously simulating multi-stage adversary intrusions continuously one by one without needing button clicks!'
                : 'Want the full APT attack kill-chains to cycle automatically as well? Enable Continuous Auto-Cycle to run non-stop with zero button clicks.'}
            </p>
          </div>

          <button
            onClick={onToggleAutoCycle}
            className={`cyber-btn ${autoCycleScenarios ? 'cyber-btn-primary' : ''}`}
            style={{
              padding: '9px 18px',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: autoCycleScenarios ? '#0284c7' : '#ffffff',
              color: autoCycleScenarios ? '#ffffff' : '#0f172a',
              border: autoCycleScenarios ? 'none' : '1.5px solid #0284c7',
              cursor: 'pointer',
              boxShadow: autoCycleScenarios ? '0 0 10px rgba(2, 132, 199, 0.4)' : 'none',
            }}
          >
            <RotateCcw size={14} className={autoCycleScenarios ? 'spin-slow' : ''} />
            <span>{autoCycleScenarios ? 'Stop Auto-Cycle' : '▶ Run Continuous Auto-Cycle'}</span>
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
                      <span>{autoCycleScenarios ? 'Queued in Auto-Cycle' : 'Simulate Kill-Chain'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Kill-Chain Execution Pipeline */}
      {currentScenario && (
        <div className="glass-panel" style={{ padding: 22, border: '2px solid #0284c7', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="#0284c7" />
                <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>
                  ACTIVE REPLAY: {currentScenario.name.toUpperCase()}
                </h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                AUTONOMOUS MULTI-STAGE KILL-CHAIN ADVANCEMENT
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 12, padding: '4px 10px' }}>
                STAGE {activeStepIndex} OF {currentScenario.steps.length}
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
