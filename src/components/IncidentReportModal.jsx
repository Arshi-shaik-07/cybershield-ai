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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840, padding: 30, background: '#ffffff' }}>
        {/* Report Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #0284c7',
          paddingBottom: 16,
          marginBottom: 20,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 11, fontWeight: 700 }}>
                CYBER DECEPTION & BLOCKCHAIN AUDIT
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                REF: {reportId}
              </span>
            </div>
            <h2 style={{ fontSize: 22, color: 'var(--text-primary)', marginTop: 4 }}>
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
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer', marginLeft: 6 }}>
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
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>THREAT CONDITION</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: threatLevel === 'CRITICAL' ? '#dc2626' : '#059669', marginTop: 4 }}>
              {threatLevel}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>LOGGED INCIDENTS</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
              {incidents.length} EVENTS
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>DECOYS TRIPPED</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#b45309', marginTop: 4 }}>
              {decoys.filter(d => d.triggersCount > 0).length} OF {decoys.length}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>BLOCKCHAIN PROOF</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginTop: 4 }}>
              {blocks.length} BLOCKS SEALED
            </div>
          </div>
        </div>

        {/* Reconstructed Kill-Chain Table */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Crosshair size={16} color="#0284c7" />
            RECONSTRUCTED INTRUDER KILL-CHAIN & MITRE ATT&CK ALIGNMENT
          </h4>

          {incidents.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              No incidents registered during this operational session.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', background: '#f8fafc', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>PHASE</th>
                  <th style={{ padding: '8px 10px' }}>MITRE TACTIC</th>
                  <th style={{ padding: '8px 10px' }}>TECHNIQUE</th>
                  <th style={{ padding: '8px 10px' }}>DECOY ASSET TRIPPED</th>
                  <th style={{ padding: '8px 10px' }}>IMMUTABLE EVIDENCE HASH</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc, i) => (
                  <tr key={inc.id || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 10px', color: 'var(--text-primary)', fontWeight: 700 }}>0{i + 1}</td>
                    <td style={{ padding: '8px 10px', color: '#0284c7', fontWeight: 600 }}>{inc.tactic || 'Discovery'}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{inc.technique || 'T1083'}</td>
                    <td style={{ padding: '8px 10px', color: '#b45309', fontWeight: 500 }}>{inc.decoyId || 'Decoy Gateway'}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#059669', fontWeight: 600 }}>
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
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 8,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              MATHEMATICALLY TAMPER-EVIDENT FORENSIC EVIDENCE
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              All dynamic incident telemetry, canary pingbacks, and lateral movement hops are cryptographically anchored in the DecoyGrid blockchain ledger. Any retrospective log deletion or anti-forensic modification by threat actors is immediately detectable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
