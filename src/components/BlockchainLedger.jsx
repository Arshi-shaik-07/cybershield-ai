import React, { useState } from 'react';
import { 
  Blocks, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Hash, 
  Coins, 
  ExternalLink, 
  Search, 
  Sparkles,
  RefreshCw,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import { computeHash, verifyIncidentIntegrity } from '../utils/cryptoUtils';

export default function BlockchainLedger({
  blocks,
  incidents,
  onTamperIncident,
  onRestoreIncident,
}) {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifyingIncidentId, setVerifyingIncidentId] = useState(null);

  const selectedBlock = blocks.find(b => b.blockIndex === selectedBlockIndex) || blocks[blocks.length - 1];

  const handleVerify = (incident) => {
    setVerifyingIncidentId(incident.id);
    const block = blocks.find(b => b.blockIndex === (incident.blockNumber || 1)) || blocks[1] || blocks[0];
    const result = verifyIncidentIntegrity(incident, block);
    setVerificationResult({
      incidentId: incident.id,
      ...result,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Blockchain Network Overview Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}>
        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>DECOYGRID BLOCK HEIGHT</span>
            <Blocks size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            #{blocks.length - 1}
          </div>
          <p style={{ fontSize: 11, color: '#0284c7', marginTop: 4, fontWeight: 600 }}>
            IMMUTABLE BLOCKS MINED
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>EVIDENCE TRANSACTIONS</span>
            <FileCode size={18} color="#059669" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#059669', marginTop: 8 }}>
            {blocks.reduce((acc, b) => acc + (b.transactionsCount || 0), 0)}
          </div>
          <p style={{ fontSize: 11, color: '#059669', marginTop: 4, fontWeight: 600 }}>
            FORENSIC AUDIT TRAILS SEALED
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>CONSENSUS PROTOCOL</span>
            <ShieldCheck size={18} color="#7c3aed" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>
            PoA (Proof-of-Authority)
          </div>
          <p style={{ fontSize: 11, color: '#7c3aed', marginTop: 4, fontWeight: 600 }}>
            DECENTRALIZED SOC VALIDATORS
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>CANARY SMART CONTRACT</span>
            <Coins size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#d97706', marginTop: 14 }}>
            $50,000 USDT TRAP
          </div>
          <p style={{ fontSize: 11, color: '#b45309', marginTop: 4, fontWeight: 600 }}>
            ON-CHAIN HONEYPOT CONTRACT
          </p>
        </div>
      </div>

      {/* Main Two-Column View: Block Explorer on Left, Tamper-Proof Verification Suite on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: 20,
      }}>
        {/* Block Explorer */}
        <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 6,
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Blocks size={18} color="#7c3aed" />
              </div>
              <div>
                <h3 style={{ fontSize: 17, color: 'var(--text-primary)' }}>DECOYGRID ON-CHAIN BLOCK EXPLORER</h3>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  CRYPTOGRAPHIC BLOCK CHAINING & DYNAMIC MERKLE ROOTS
                </p>
              </div>
            </div>

            {/* Block Selector */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {blocks.map(b => (
                <button
                  key={b.blockIndex}
                  onClick={() => setSelectedBlockIndex(b.blockIndex)}
                  className={`cyber-btn cyber-btn-sm ${selectedBlock.blockIndex === b.blockIndex ? 'cyber-btn-primary' : ''}`}
                  style={{ padding: '4px 10px', fontSize: 11 }}
                >
                  Block #{b.blockIndex}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Block Card */}
          {selectedBlock && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="cyber-badge cyber-badge-purple" style={{ fontSize: 12 }}>
                  BLOCK #{selectedBlock.blockIndex} (SEALED)
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  NONCE: {selectedBlock.nonce}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>BLOCK HASH:</span>
                  <div className="mono" style={{ color: '#0284c7', wordBreak: 'break-all', fontSize: 11, marginTop: 2, fontWeight: 600 }}>
                    {selectedBlock.blockHash}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>PREVIOUS BLOCK HASH:</span>
                  <div className="mono" style={{ color: 'var(--text-secondary)', wordBreak: 'break-all', fontSize: 11, marginTop: 2 }}>
                    {selectedBlock.previousHash}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>MERKLE ROOT OF INCIDENTS:</span>
                  <div className="mono" style={{ color: '#059669', wordBreak: 'break-all', fontSize: 11, marginTop: 2, fontWeight: 600 }}>
                    {selectedBlock.merkleRoot}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>VALIDATOR NODE:</span>
                    <div className="mono" style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 600 }}>{selectedBlock.validator}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>TIMESTAMP:</span>
                    <div className="mono" style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 600 }}>
                      {new Date(selectedBlock.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions in Block */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  TRANSACTIONS SEALED IN THIS BLOCK ({selectedBlock.transactions.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                  {selectedBlock.transactions.map((tx, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        fontSize: 11,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontWeight: 700 }}>
                        <span>{tx.action || tx.title || 'FORENSIC_TRIPWIRE_TRIGGER'}</span>
                        <span className="mono" style={{ color: '#0284c7' }}>TX #{idx + 1}</span>
                      </div>
                      <div className="mono" style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>
                        HASH: {tx.hash ? tx.hash.substring(0, 24) + '...' : '0x88f...'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cryptographic Tamper-Verification Suite */}
        <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={18} color="#059669" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, color: 'var(--text-primary)' }}>FORENSIC INTEGRITY & TAMPER VERIFICATION</h3>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                VERIFY EVIDENCE INTEGRITY AGAINST IMMUTABLE MERKLE LEDGER
              </p>
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
            In high-profile breaches, sophisticated adversaries attempt <strong>anti-forensics</strong> (erasing event logs, modifying attacker IPs, deleting audit records). CyberShield uses on-chain Merkle root hashing to immediately expose any unauthorized modification.
          </p>

          {/* Incidents Verification List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
            {incidents.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center', padding: 20 }}>
                No incident records to verify yet. Run an attack scenario first.
              </p>
            ) : (
              incidents.map((incident) => (
                <div
                  key={incident.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
                      {incident.title || incident.action}
                    </div>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: incident.isTampered ? '#dc2626' : '#059669' }}>
                      {incident.isTampered ? '⚠ TAMPERED' : '✓ AUTHENTIC'}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ATTACKER IP: <span style={{ color: incident.isTampered ? '#dc2626' : 'var(--text-primary)', fontWeight: 600 }}>{incident.attackerIp}</span> • HASH: {incident.evidenceHash ? incident.evidenceHash.substring(0, 16) + '...' : '0x..'}
                  </div>

                  {/* Actions: Verify vs Tamper vs Restore */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => handleVerify(incident)}
                      className="cyber-btn cyber-btn-primary cyber-btn-sm"
                    >
                      <CheckCircle2 size={13} />
                      <span>Verify On-Chain</span>
                    </button>

                    {!incident.isTampered ? (
                      <button
                        onClick={() => onTamperIncident(incident.id)}
                        className="cyber-btn cyber-btn-danger cyber-btn-sm"
                        title="Simulate attacker altering logs locally"
                      >
                        <AlertTriangle size={13} />
                        <span>Simulate Tamper</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRestoreIncident(incident.id)}
                        className="cyber-btn cyber-btn-sm"
                        style={{ borderColor: '#059669', color: '#059669' }}
                        title="Recover authentic record from blockchain"
                      >
                        <RefreshCw size={13} />
                        <span>Recover from Chain</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Verification Result Box */}
          {verificationResult && (
            <div style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 8,
              background: verificationResult.valid ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${verificationResult.valid ? '#a7f3d0' : '#fecaca'}`,
              animation: 'modalIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {verificationResult.valid ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : (
                  <AlertTriangle size={18} color="#dc2626" />
                )}
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: verificationResult.valid ? '#059669' : '#dc2626',
                }}>
                  {verificationResult.valid ? 'CRYPTOGRAPHIC AUDIT PASSED' : 'ANTI-FORENSICS TAMPER DETECTED!'}
                </span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                {verificationResult.reason}
              </p>

              <div style={{ marginTop: 8, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                <div>COMPUTED HASH: {verificationResult.computedHash}</div>
                {verificationResult.expectedHash && (
                  <div>ON-CHAIN HASH: {verificationResult.expectedHash}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
