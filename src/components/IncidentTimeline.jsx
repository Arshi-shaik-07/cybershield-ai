import React, { useState } from 'react';
import { 
  History, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  AlertTriangle, 
  Flame, 
  ArrowRight, 
  Key, 
  FileText, 
  Blocks, 
  Terminal, 
  Cpu,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function IncidentTimeline({
  incidents,
  activePlaybackIndex,
  onPlaybackStep,
  onResetTimeline,
  onInspectIncident,
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { badge: 'cyber-badge-crimson', icon: <Flame size={14} color="#dc2626" /> };
      case 'high':
        return { badge: 'cyber-badge-amber', icon: <AlertTriangle size={14} color="#b45309" /> };
      case 'medium':
        return { badge: 'cyber-badge-purple', icon: <ShieldAlert size={14} color="#7c3aed" /> };
      default:
        return { badge: 'cyber-badge-cyan', icon: <History size={14} color="#0284c7" /> };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Reconstructed Attack Path Flowchart */}
      <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fecaca',
            }}>
              <ShieldAlert size={18} color="#dc2626" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, color: 'var(--text-primary)' }}>RECONSTRUCTED INTRUDER MOVEMENT PATH</h3>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                LATERAL TRAJECTORY CORRELATION • DYNAMIC SENSOR TRIPWIRE RECONSTRUCTION
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => onPlaybackStep(activePlaybackIndex > 0 ? activePlaybackIndex - 1 : 0)}
              className="cyber-btn cyber-btn-sm"
              title="Previous Step"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => onPlaybackStep(activePlaybackIndex + 1)}
              className="cyber-btn cyber-btn-sm"
              title="Next Step"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={onResetTimeline}
              className="cyber-btn cyber-btn-sm"
              title="Reset Timeline Playback"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Attack Trajectory Hop Cards */}
        {incidents.length === 0 ? (
          <div style={{
            padding: 30,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            border: '2px dashed var(--border-strong)',
            borderRadius: 8,
            background: '#f8fafc',
          }}>
            NO ACTIVE INTRUSIONS LOGGED. LAUNCH AN ATTACK SCENARIO OR RUN TERMINAL EXPLOITS TO RECONSTRUCT MOVEMENT DYNAMICALLY.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 8,
          }}>
            {incidents.map((inc, idx) => {
              const isSelected = activePlaybackIndex === idx;

              return (
                <React.Fragment key={inc.id || idx}>
                  <div
                    onClick={() => onPlaybackStep(idx)}
                    style={{
                      minWidth: 230,
                      background: isSelected ? '#f0f9ff' : '#f8fafc',
                      border: isSelected ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      padding: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 2px 10px rgba(2, 132, 199, 0.15)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span className="mono" style={{ fontSize: 10, color: '#0284c7', fontWeight: 700 }}>
                        HOP 0{idx + 1}
                      </span>
                      <span className={`cyber-badge ${getSeverityStyle(inc.severity).badge}`} style={{ fontSize: 9 }}>
                        {inc.severity}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {inc.title || inc.action}
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                      <span>{inc.sourceNode?.replace('node-', '')}</span>
                      <ArrowRight size={11} color="#0284c7" />
                      <span style={{ color: '#b45309' }}>{inc.targetNode?.replace('node-', '')}</span>
                    </div>

                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                      IP: {inc.attackerIp}
                    </div>
                  </div>

                  {idx < incidents.length - 1 && (
                    <ArrowRight size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Chronological Forensic Incident Log */}
      <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <h3 style={{ fontSize: 17, color: 'var(--text-primary)' }}>FORENSIC INCIDENT TIMELINE & MITRE ATT&CK MATRIX</h3>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              DYNAMIC DECOY SENSOR AUDIT TRAIL • TAMPER-PROOF HASH LOGGING
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(s => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`cyber-btn cyber-btn-sm ${filterSeverity === s ? 'cyber-btn-primary' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredIncidents.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center', padding: 20 }}>
              No incidents matching current filter.
            </p>
          ) : (
            filteredIncidents.map((incident, idx) => {
              const sev = getSeverityStyle(incident.severity);

              return (
                <div
                  key={incident.id || idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 280 }}>
                    <div style={{
                      marginTop: 2,
                      width: 30,
                      height: 30,
                      borderRadius: 6,
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {sev.icon}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {incident.title || incident.action}
                        </span>
                        <span className={`cyber-badge ${sev.badge}`}>
                          {incident.severity}
                        </span>
                        {incident.tactic && (
                          <span className="cyber-badge cyber-badge-cyan">
                            {incident.tactic}
                          </span>
                        )}
                        {incident.technique && (
                          <span className="cyber-badge" style={{ color: '#b45309', background: '#fffbeb', borderColor: '#fde68a' }}>
                            {incident.technique}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {incident.summary || incident.detail}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, flexWrap: 'wrap', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        <span>TIMESTAMP: <strong>{new Date(incident.timestamp).toLocaleTimeString()}</strong></span>
                        <span>ATTACKER IP: <strong style={{ color: 'var(--text-primary)' }}>{incident.attackerIp}</strong></span>
                        {incident.decoyId && (
                          <span style={{ color: '#0284c7', fontWeight: 600 }}>TRIPPED: {incident.decoyId}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Proof Badge */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 6,
                  }}>
                    <div className="cyber-badge cyber-badge-purple" style={{ fontSize: 10 }}>
                      <Blocks size={12} />
                      <span>ON-CHAIN ANCHOR: BLOCK #{incident.blockNumber || 1}</span>
                    </div>

                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }} title={incident.evidenceHash}>
                      HASH: {incident.evidenceHash ? `${incident.evidenceHash.substring(0, 10)}...${incident.evidenceHash.substring(incident.evidenceHash.length - 8)}` : '0x7e8...b91'}
                    </div>

                    <button
                      onClick={() => onInspectIncident(incident)}
                      className="cyber-btn cyber-btn-sm"
                      style={{ padding: '3px 8px', fontSize: 11, marginTop: 2 }}
                    >
                      Verify Proof
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
