import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  Blocks, 
  CheckCircle2, 
  Clock, 
  Crosshair 
} from 'lucide-react';

export default function IncidentReportModal({
  isOpen,
  onClose,
  incidents,
  blocks,
  decoys,
  threatLevel,
}) {
  if (!isOpen) return null;

  const reportId = `CS-AUDIT-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
  const generationTime = new Date().toUTCString();

  const handleDownloadJSON = () => {
    const reportData = {
      reportId,
      generationTime,
      threatLevel,
      summary: {
        totalIncidents: incidents.length,
        criticalAlerts: incidents.filter(i => i.severity === 'Critical').length,
        decoysTripped: decoys.filter(d => d.triggersCount > 0).length,
        blockchainHeight: blocks.length - 1,
      },
      blockchainLedger: blocks,
      forensicIncidents: incidents,
      decoysInventory: decoys,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840, padding: 30 }}>
        {/* Report Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--cyber-cyan)',
          paddingBottom: 16,
          marginBottom: 20,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 11 }}>
                CYBER DECEPTION & BLOCKCHAIN AUDIT
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                REF: {reportId}
              </span>
            </div>
            <h2 style={{ fontSize: 22, color: '#fff', marginTop: 4 }}>
              EXECUTIVE INCIDENT FORENSIC & PROVENANCE REPORT
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handleDownloadJSON} className="cyber-btn cyber-btn-sm" title="Download Machine-Readable JSON">
              <Download size={13} />
              <span>JSON Export</span>
            </button>
            <button onClick={handlePrint} className="cyber-btn cyber-btn-primary cyber-btn-sm" title="Print Report">
              <Printer size={13} />
              <span>Print Report</span>
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', marginLeft: 6 }}>
              ✕
            </button>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}>
          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>THREAT CONDITION</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: threatLevel === 'CRITICAL' ? 'var(--cyber-crimson)' : 'var(--cyber-emerald)', marginTop: 4 }}>
              {threatLevel}
            </div>
          </div>

          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>LOGGED INCIDENTS</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4 }}>
              {incidents.length} EVENTS
            </div>
          </div>

          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>DECOYS TRIPPED</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cyber-amber)', marginTop: 4 }}>
              {decoys.filter(d => d.triggersCount > 0).length} OF {decoys.length}
            </div>
          </div>

          <div style={{ background: 'rgba(8, 14, 28, 0.7)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>BLOCKCHAIN PROOF</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cyber-cyan)', marginTop: 4 }}>
              {blocks.length} BLOCKS SEALED
            </div>
          </div>
        </div>

        {/* Reconstructed Kill-Chain Table */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Crosshair size={16} color="var(--cyber-cyan)" />
            RECONSTRUCTED INTRUDER KILL-CHAIN & MITRE ATT&CK ALIGNMENT
          </h4>

          {incidents.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              No incidents registered during this operational session.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>PHASE</th>
                  <th style={{ padding: '8px 10px' }}>MITRE TACTIC</th>
                  <th style={{ padding: '8px 10px' }}>TECHNIQUE</th>
                  <th style={{ padding: '8px 10px' }}>DECOY ASSET TRIPPED</th>
                  <th style={{ padding: '8px 10px' }}>IMMUTABLE EVIDENCE HASH</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc, i) => (
                  <tr key={inc.id || i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '8px 10px', color: '#fff', fontWeight: 600 }}>0{i + 1}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--cyber-cyan)' }}>{inc.tactic || 'Discovery'}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{inc.technique || 'T1083'}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--cyber-amber)' }}>{inc.decoyId || 'Decoy Gateway'}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyber-emerald)' }}>
                      {inc.evidenceHash ? inc.evidenceHash.substring(0, 18) + '...' : '0x00...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Blockchain Cryptographic Provenance Guarantee */}
        <div style={{
          background: 'rgba(0, 240, 255, 0.05)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <CheckCircle2 size={24} color="var(--cyber-emerald)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              MATHEMATICALLY TAMPER-EVIDENT FORENSIC EVIDENCE
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              All incident telemetry, canary pingbacks, and lateral movement hops were cryptographically anchored in the DecoyGrid blockchain ledger. Any retrospective log deletion or anti-forensic modification by threat actors is immediately detectable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
