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
        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>DECOYGRID HEIGHT</span>
            <Blocks size={18} color="var(--cyber-cyan)" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 8 }}>
            #{blocks.length - 1}
          </div>
          <p style={{ fontSize: 11, color: 'var(--cyber-cyan)', marginTop: 4 }}>
            TOTAL BLOCKS MINED ON-CHAIN
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>EVIDENCE TRANSACTIONS</span>
            <FileCode size={18} color="var(--cyber-emerald)" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--cyber-emerald)', marginTop: 8 }}>
            {blocks.reduce((acc, b) => acc + (b.transactionsCount || 0), 0)}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-emerald)', marginTop: 4 }}>
            IMMUTABLE FORENSIC LOGS
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>CONSENSUS PROTOCOL</span>
            <ShieldCheck size={18} color="var(--cyber-violet)" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 12 }}>
            PoA (Proof-of-Authority)
          </div>
          <p style={{ fontSize: 11, color: 'var(--cyber-violet)', marginTop: 4 }}>
            DECENTRALIZED SOC VALIDATORS
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>CANARY SMART CONTRACT</span>
            <Coins size={18} color="var(--cyber-amber)" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cyber-amber)', marginTop: 14 }}>
            $50,000 USDT TRAP
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-amber)', marginTop: 4 }}>
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
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid var(--cyber-violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Blocks size={18} color="var(--cyber-violet)" />
              </div>
              <div>
                <h3 style={{ fontSize: 17, color: '#fff' }}>DECOYGRID ON-CHAIN BLOCK EXPLORER</h3>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  CRYPTOGRAPHIC BLOCK CHAINING & MERKLE ROOTS
                </p>
              </div>
            </div>

            {/* Block Selector */}
            <div style={{ display: 'flex', gap: 4 }}>
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
              background: 'rgba(8, 14, 28, 0.8)',
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
                  <span style={{ color: 'var(--text-muted)' }}>BLOCK HASH:</span>
                  <div className="mono" style={{ color: 'var(--cyber-cyan)', wordBreak: 'break-all', fontSize: 11, marginTop: 2 }}>
                    {selectedBlock.blockHash}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>PREVIOUS BLOCK HASH:</span>
                  <div className="mono" style={{ color: 'var(--text-secondary)', wordBreak: 'break-all', fontSize: 11, marginTop: 2 }}>
                    {selectedBlock.previousHash}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>MERKLE ROOT OF INCIDENTS:</span>
                  <div className="mono" style={{ color: 'var(--cyber-emerald)', wordBreak: 'break-all', fontSize: 11, marginTop: 2 }}>
                    {selectedBlock.merkleRoot}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>VALIDATOR NODE:</span>
                    <div className="mono" style={{ color: '#fff', fontSize: 11 }}>{selectedBlock.validator}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>TIMESTAMP:</span>
                    <div className="mono" style={{ color: '#fff', fontSize: 11 }}>
                      {new Date(selectedBlock.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions in Block */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  TRANSACTIONS SEALED IN THIS BLOCK ({selectedBlock.transactions.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                  {selectedBlock.transactions.map((tx, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(4, 7, 16, 0.6)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        fontSize: 11,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 600 }}>
                        <span>{tx.action || tx.title || 'FORENSIC_TRIPWIRE_TRIGGER'}</span>
                        <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>TX #{idx + 1}</span>
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
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--cyber-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={18} color="var(--cyber-emerald)" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, color: '#fff' }}>FORENSIC INTEGRITY & TAMPER VERIFICATION</h3>
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
                    background: 'rgba(8, 14, 28, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>
                      {incident.title || incident.action}
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: incident.isTampered ? 'var(--cyber-crimson)' : 'var(--cyber-emerald)' }}>
                      {incident.isTampered ? '⚠ TAMPERED' : '✓ AUTHENTIC'}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ATTACKER IP: <span style={{ color: incident.isTampered ? 'var(--cyber-crimson)' : '#fff' }}>{incident.attackerIp}</span> • HASH: {incident.evidenceHash ? incident.evidenceHash.substring(0, 16) + '...' : '0x..'}
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
                        style={{ borderColor: 'var(--cyber-emerald)', color: 'var(--cyber-emerald)' }}
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
              background: verificationResult.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${verificationResult.valid ? 'var(--cyber-emerald)' : 'var(--cyber-crimson)'}`,
              animation: 'modalIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {verificationResult.valid ? (
                  <CheckCircle2 size={18} color="var(--cyber-emerald)" />
                ) : (
                  <AlertTriangle size={18} color="var(--cyber-crimson)" />
                )}
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: verificationResult.valid ? 'var(--cyber-emerald)' : 'var(--cyber-crimson)',
                }}>
                  {verificationResult.valid ? 'CRYPTOGRAPHIC AUDIT PASSED' : 'ANTI-FORENSICS TAMPER DETECTED!'}
                </span>
              </div>

              <p style={{ fontSize: 11, color: '#fff', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
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
