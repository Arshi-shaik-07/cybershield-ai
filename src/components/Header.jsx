import React from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Blocks, 
  FileText, 
  Play, 
  Cpu, 
  Activity,
  Radio,
  BellRing
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function Header({
  activeScenario,
  onLaunchScenario,
  onResetSystem,
  onOpenReport,
  soundEnabled,
  onToggleSound,
  blockchainHeight,
  threatLevel = 'NORMAL',
  activeIncidentsCount = 0,
}) {
  const getDefconStyle = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return { badge: 'cyber-badge-crimson', text: 'DEFCON 1 — ACTIVE INTRUSION DETECTED' };
      case 'HIGH':
        return { badge: 'cyber-badge-amber', text: 'DEFCON 2 — HONEYTOKEN COMPROMISED' };
      case 'ELEVATED':
        return { badge: 'cyber-badge-purple', text: 'DEFCON 3 — DECOY PROBED' };
      default:
        return { badge: 'cyber-badge-emerald', text: 'DEFCON 5 — SYSTEM SECURE / ARMED' };
    }
  };

  const defcon = getDefconStyle();

  const handleTestSound = () => {
    soundFX.playAlarmAlert();
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
    }}>
      <div style={{
        maxWidth: 1720,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            position: 'relative',
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #e0f2fe, #ede9fe)',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
          }}>
            <ShieldAlert size={26} color="#0284c7" />
            <div style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: threatLevel === 'CRITICAL' ? 'var(--cyber-crimson)' : 'var(--cyber-emerald)',
              boxShadow: `0 0 6px ${threatLevel === 'CRITICAL' ? 'var(--cyber-crimson)' : 'var(--cyber-emerald)'}`,
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                background: 'linear-gradient(90deg, #0f172a 30%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                CYBERSHIELD AI
              </h1>
              <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 10, fontWeight: 700 }}>
                v2.6 SENTINEL
              </span>
            </div>
            <p style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}>
              CYBER DECEPTION SYSTEM & BLOCKCHAIN PROVENANCE
            </p>
          </div>
        </div>

        {/* Center Live Threat Condition Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className={`cyber-badge ${defcon.badge}`} style={{ padding: '6px 14px', fontSize: 12 }}>
            <Activity size={14} />
            <span>{defcon.text}</span>
          </div>

          <div className="cyber-badge cyber-badge-purple" style={{ padding: '6px 12px' }}>
            <Blocks size={14} />
            <span>DECOYGRID LEDGER: BLOCK #{blockchainHeight}</span>
          </div>
        </div>

        {/* Action Controls & Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Quick Attack Simulator Trigger */}
          <button
            onClick={() => onLaunchScenario('scenario-phish-lateral')}
            disabled={activeScenario !== null}
            className="cyber-btn cyber-btn-primary cyber-btn-sm"
            title="Simulate Spear-Phishing & Lateral Pivot Kill-Chain"
          >
            <Play size={13} />
            <span>Simulate Attack</span>
          </button>

          {/* Test Alert Sound Button */}
          <button
            onClick={handleTestSound}
            className="cyber-btn cyber-btn-sm"
            style={{ borderColor: '#fca5a5', color: '#dc2626' }}
            title="Test the new solid klaxon intrusion alarm"
          >
            <BellRing size={13} />
            <span>Test Sound</span>
          </button>

          {/* Incident Report Trigger */}
          <button
            onClick={onOpenReport}
            className="cyber-btn cyber-btn-sm"
            title="Generate Cryptographic Incident Report"
          >
            <FileText size={14} color="#0284c7" />
            <span>Forensic Report</span>
          </button>

          {/* Audio Effects Toggle */}
          <button
            onClick={onToggleSound}
            className="cyber-btn cyber-btn-sm"
            style={{ width: 36, padding: 0 }}
            title={soundEnabled ? 'Mute SOC Sound FX' : 'Enable SOC Sound FX'}
          >
            {soundEnabled ? <Volume2 size={16} color="#0284c7" /> : <VolumeX size={16} color="var(--text-muted)" />}
          </button>

          {/* Reset System */}
          <button
            onClick={onResetSystem}
            className="cyber-btn cyber-btn-sm"
            style={{ borderColor: 'rgba(220, 38, 38, 0.3)' }}
            title="Reset All Network Nodes and Decoys to Armed State"
          >
            <RotateCcw size={14} color="#dc2626" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
