import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, HelpCircle, Trash2, CornerDownLeft, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function AttackerTerminal({ onExecuteCommand }) {
  const [history, setHistory] = useState([
    { type: 'system', text: '=====================================================================' },
    { type: 'system', text: ' CYBERSHIELD RED-TEAM ADVERSARY EMULATION CONSOLE [C2-SESSION-01]' },
    { type: 'system', text: ' Type "help" to display available exploit & reconnaissance commands.' },
    { type: 'system', text: ' Click any suggestion pill below to execute an attack interactively.' },
    { type: 'system', text: '=====================================================================' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText) => {
    const raw = (cmdText || inputVal).trim();
    if (!raw) return;

    soundFX.playKeyClick();

    // Append user command
    const newHistory = [...history, { type: 'input', text: `redteam@intruder-box:~$ ${raw}` }];

    const lower = raw.toLowerCase();
    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (command === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (command === 'help') {
      newHistory.push(
        { type: 'output', text: 'AVAILABLE ADVERSARY COMMANDS:' },
        { type: 'output', text: '  scan <ip/host>        : Probe network ports & discover exposed services' },
        { type: 'output', text: '  cat <decoy_file>      : Inspect or read confidential file content' },
        { type: 'output', text: '  download <filename>   : Exfiltrate decoy document / trigger canary beacon' },
        { type: 'output', text: '  use-cred <username>   : Attempt authentication using harvested honeytoken' },
        { type: 'output', text: '  ssh <target>          : Attempt remote shell connection to host' },
        { type: 'output', text: '  exfil <s3_bucket>     : Attempt bulk cloud object exfiltration' },
        { type: 'output', text: '  clear                 : Clear terminal console screen' }
      );
    } else {
      // Dispatch command to parent app logic to trigger real alerts and blockchain blocks!
      const result = onExecuteCommand(command, arg, raw);
      if (result && Array.isArray(result)) {
        result.forEach(line => newHistory.push({ type: 'output', text: line }));
      } else if (typeof result === 'string') {
        newHistory.push({ type: 'output', text: result });
      }
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const suggestions = [
    'scan 198.51.100.2',
    'cat prod-payment-gateway.env',
    'download Q4_Executive_Payroll_Bonus.xlsx',
    'use-cred DOMAIN\\svc_backup_admin',
    'ssh admin@10.0.4.99',
    'exfil s3://corp-backups-q4',
  ];

  return (
    <div className="glass-panel" style={{ padding: 20 }}>
      {/* Terminal Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 12,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--cyber-crimson)',
          }}>
            <TerminalIcon size={18} color="var(--cyber-crimson)" />
          </div>
          <div>
            <h3 style={{ fontSize: 16, color: '#fff' }}>INTERACTIVE RED-TEAM ATTACKER CONSOLE</h3>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              MANUAL PROBING & LIVE DECOY TRIPWIRE EMULATION
            </p>
          </div>
        </div>

        <button
          onClick={() => setHistory([])}
          className="cyber-btn cyber-btn-sm"
          title="Clear Terminal"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      {/* Quick Action Suggestion Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={12} color="var(--cyber-cyan)" /> QUICK EXPLOITS:
        </span>
        {suggestions.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="cyber-badge"
            style={{
              cursor: 'pointer',
              background: 'rgba(0, 240, 255, 0.08)',
              borderColor: 'rgba(0, 240, 255, 0.25)',
              color: 'var(--cyber-cyan)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Screen Window */}
      <div style={{
        background: '#040711',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: 16,
        height: 380,
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        lineHeight: 1.6,
      }}>
        {history.map((item, idx) => (
          <div
            key={idx}
            style={{
              color:
                item.type === 'system'
                  ? 'var(--cyber-cyan)'
                  : item.type === 'input'
                  ? '#fbbf24'
                  : item.text.includes('ALERT') || item.text.includes('TRIPPED') || item.text.includes('DETECTED')
                  ? 'var(--cyber-crimson)'
                  : item.text.includes('SUCCESS') || item.text.includes('MINED')
                  ? 'var(--cyber-emerald)'
                  : 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              marginBottom: 4,
            }}
          >
            {item.text}
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      {/* Terminal Input Line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 12,
          background: '#040711',
          border: '1px solid var(--border-strong)',
          borderRadius: 6,
          padding: '8px 14px',
        }}
      >
        <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>
          redteam@intruder-box:~$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type 'help' or command..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="cyber-btn cyber-btn-primary cyber-btn-sm"
          style={{ padding: '4px 10px' }}
        >
          <CornerDownLeft size={13} />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
}
