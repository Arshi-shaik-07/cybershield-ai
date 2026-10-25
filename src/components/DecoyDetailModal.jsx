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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24, background: '#ffffff' }}>
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
              width: 38,
              height: 38,
              borderRadius: 8,
              background: '#e0f2fe',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={20} color="#0284c7" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>{decoy.name}</h3>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                DYNAMIC DECOY ASSET INSPECTION & FORENSIC CANARY BEACON
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer' }}>
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
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{decoy.category}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>REALISM SCORE</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0284c7', marginTop: 2 }}>{decoy.realismScore}% CAMOUFLAGE</div>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: decoy.triggersCount > 0 ? '#dc2626' : '#059669', marginTop: 2 }}>
              {decoy.triggersCount > 0 ? `TRIPPED (${decoy.triggersCount}x)` : 'ARMED & MONITORING'}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>CANARY TOKEN</span>
            <div className="mono" style={{ fontSize: 11, color: '#b45309', marginTop: 2, fontWeight: 700 }}>{decoy.canaryToken}</div>
          </div>
        </div>

        {/* Description & Tripwire Mechanism */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600 }}>
              TRIPWIRE TRIGGER MECHANISM
            </span>
            <p style={{ fontSize: 13, color: '#0284c7', marginTop: 2, fontWeight: 700 }}>
              {decoy.tripwireType}
            </p>
          </div>

          <div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600 }}>
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
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600 }}>
                DECOY PAYLOAD / FILE CONTENTS PREVIEW
              </span>
              <span className="mono" style={{ fontSize: 10, color: '#0284c7', fontWeight: 600 }}>
                SIZE: {decoy.fileSize || 'N/A'}
              </span>
            </div>
            <pre style={{
              background: '#0f172a',
              border: '1px solid #334155',
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
