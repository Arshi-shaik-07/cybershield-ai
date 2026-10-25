import React from 'react';
import { 
  FileText, 
  Key, 
  Server, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  Radio, 
  Lock, 
  Hash, 
  Download, 
  Copy 
} from 'lucide-react';

export default function DecoyDetailModal({ decoy, onClose, onTestTripwire }) {
  if (!decoy) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 14,
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(0, 240, 255, 0.12)',
              border: '1px solid var(--cyber-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={20} color="var(--cyber-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, color: '#fff' }}>{decoy.name}</h3>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                DECOY ASSET INSPECTION & FORENSIC CANARY BEACON
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Status & Attributes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>CATEGORY</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 2 }}>{decoy.category}</div>
          </div>

          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>REALISM SCORE</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cyber-cyan)', marginTop: 2 }}>{decoy.realismScore}% CAMOUFLAGE</div>
          </div>

          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>STATUS</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: decoy.triggersCount > 0 ? 'var(--cyber-crimson)' : 'var(--cyber-emerald)', marginTop: 2 }}>
              {decoy.triggersCount > 0 ? `TRIPPED (${decoy.triggersCount}x)` : 'ARMED & MONITORING'}
            </div>
          </div>

          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>CANARY TOKEN</span>
            <div className="mono" style={{ fontSize: 11, color: 'var(--cyber-amber)', marginTop: 2 }}>{decoy.canaryToken}</div>
          </div>
        </div>

        {/* Description & Tripwire Mechanism */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              TRIPWIRE TRIGGER MECHANISM
            </span>
            <p style={{ fontSize: 13, color: 'var(--cyber-cyan)', marginTop: 2, fontWeight: 600 }}>
              {decoy.tripwireType}
            </p>
          </div>

          <div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              BEHAVIORAL DESCRIPTION
            </span>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
              {decoy.description}
            </p>
          </div>
        </div>

        {/* Payload / File Content Preview */}
        {decoy.previewContent && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                DECOY PAYLOAD / FILE CONTENTS PREVIEW
              </span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--cyber-cyan)' }}>
                SIZE: {decoy.fileSize || 'N/A'}
              </span>
            </div>
            <pre style={{
              background: '#040711',
              border: '1px solid var(--border-strong)',
              borderRadius: 6,
              padding: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#38bdf8',
              whiteSpace: 'pre-wrap',
              maxHeight: 180,
              overflowY: 'auto',
              lineHeight: 1.5,
            }}>
              {decoy.previewContent}
            </pre>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <button
            onClick={() => {
              onTestTripwire(decoy);
              onClose();
            }}
            className="cyber-btn cyber-btn-danger"
          >
            <Flame size={14} />
            <span>Simulate Attacker Interacting</span>
          </button>

          <button onClick={onClose} className="cyber-btn">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
