import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import NetworkTopology from './components/NetworkTopology';
import DecoyManager from './components/DecoyManager';
import AttackSimulator from './components/AttackSimulator';
import AttackerTerminal from './components/AttackerTerminal';
import IncidentTimeline from './components/IncidentTimeline';
import BlockchainLedger from './components/BlockchainLedger';
import DecoyDetailModal from './components/DecoyDetailModal';
import IncidentReportModal from './components/IncidentReportModal';

import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  INITIAL_DECOYS, 
  ATTACK_SCENARIOS, 
  getGenesisBlock 
} from './utils/initialData';
import { computeHash, createBlock } from './utils/cryptoUtils';
import { soundFX } from './utils/soundEffects';

import { 
  Network, 
  FileText, 
  Terminal, 
  History, 
  Blocks, 
  Play, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Radio
} from 'lucide-react';

export default function App() {
  // Navigation Tabs: 'TOPOLOGY', 'DECOYS', 'SIMULATOR', 'TERMINAL', 'TIMELINE', 'BLOCKCHAIN'
  const [activeTab, setActiveTab] = useState('TOPOLOGY');

  // Network & Decoy State with dynamic persistence
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [decoys, setDecoys] = useState(() => {
    try {
      const saved = localStorage.getItem('cybershield_decoys');
      return saved ? JSON.parse(saved) : INITIAL_DECOYS;
    } catch (e) {
      return INITIAL_DECOYS;
    }
  });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [inspectedDecoy, setInspectedDecoy] = useState(null);

  // Simulation State
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAttackPath, setActiveAttackPath] = useState([]);
  const timerRef = useRef(null);

  // Forensics & Blockchain State
  const [incidents, setIncidents] = useState([]);
  const [blocks, setBlocks] = useState(() => [getGenesisBlock()]);
  const [activePlaybackIndex, setActivePlaybackIndex] = useState(0);
  const [threatLevel, setThreatLevel] = useState('NORMAL');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persist decoys changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cybershield_decoys', JSON.stringify(decoys));
    } catch (e) {}
  }, [decoys]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Sound FX toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.toggle(next);
  };

  // Helper: Trigger Decoy & Mine Blockchain Block with Fast Hashing
  const triggerDecoyTripwire = ({
    decoyId,
    sourceNodeId,
    targetNodeId,
    attackerIp = '194.26.29.112',
    tactic = 'Discovery',
    technique = 'T1083 (File and Directory Discovery)',
    title,
    summary,
    severity = 'High',
  }) => {
    // 1. Play solid intrusion alert sound
    soundFX.playAlarmAlert();

    // 2. Update decoy trigger count dynamically
    let triggeredDecoyName = 'Decoy Gateway';
    setDecoys(prev =>
      prev.map(d => {
        if (d.id === decoyId) {
          triggeredDecoyName = d.name;
          return {
            ...d,
            triggersCount: (d.triggersCount || 0) + 1,
            lastTriggered: new Date().toISOString(),
          };
        }
        return d;
      })
    );

    // 3. Update node statuses
    setNodes(prev =>
      prev.map(n => {
        if (n.id === targetNodeId) {
          return {
            ...n,
            status: severity === 'Critical' ? 'breached' : 'probed',
            threatLevel: severity,
          };
        }
        return n;
      })
    );

    // 4. Update threat level
    if (severity === 'Critical') setThreatLevel('CRITICAL');
    else if (threatLevel !== 'CRITICAL') setThreatLevel('HIGH');

    // 5. Update active attack path
    if (sourceNodeId && targetNodeId) {
      setActiveAttackPath(prev => {
        const set = new Set([...prev, sourceNodeId, targetNodeId]);
        return Array.from(set);
      });
    }

    // 6. Generate dynamic cryptographic evidence hash
    const timestamp = new Date().toISOString();
    const incidentId = `INC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const evidencePayload = {
      id: incidentId,
      timestamp,
      tactic,
      decoyId: triggeredDecoyName,
      sourceNode: sourceNodeId,
      targetNode: targetNodeId,
      attackerIp,
    };
    const evidenceHash = '0x' + computeHash(evidencePayload);

    const currentBlockHeight = blocks.length;

    const newIncident = {
      id: incidentId,
      timestamp,
      title: title || `Tripwire Fired: ${triggeredDecoyName}`,
      summary: summary || `Suspicious interaction detected from ${attackerIp} touching decoy asset ${triggeredDecoyName}.`,
      severity,
      tactic,
      technique,
      decoyId: triggeredDecoyName,
      sourceNode: sourceNodeId,
      targetNode: targetNodeId,
      attackerIp,
      evidenceHash,
      blockNumber: currentBlockHeight,
      isTampered: false,
    };

    setIncidents(prev => [newIncident, ...prev]);

    // 7. Mine a new block onto DecoyGrid blockchain safely using functional updater
    setBlocks(prevBlocks => {
      const prevHash = prevBlocks[prevBlocks.length - 1]?.blockHash || '0x0000000000000000000000000000000000000000000000000000000000000000';
      const newBlock = createBlock({
        blockIndex: prevBlocks.length,
        previousHash: prevHash,
        transactions: [
          {
            txHash: '0x' + computeHash(incidentId + timestamp),
            incidentId,
            timestamp,
            action: 'DECOY_TRIPWIRE_TRIGGERED',
            hash: evidenceHash,
            title: newIncident.title,
          },
        ],
      });
      return [...prevBlocks, newBlock];
    });

    setTimeout(() => soundFX.playBlockMinted(), 200);
  };

  // Automated Scenario Runner
  const handleLaunchScenario = (scenarioId) => {
    const scenario = ATTACK_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setActiveScenarioId(scenarioId);
    setActiveStepIndex(1);
    setIsRunning(true);
    setActiveAttackPath([]);

    executeScenarioStep(scenario, 0);
  };

  const executeScenarioStep = (scenario, stepIndex) => {
    if (stepIndex >= scenario.steps.length) {
      setIsRunning(false);
      soundFX.playContainmentSuccess();
      return;
    }

    const step = scenario.steps[stepIndex];
    setActiveStepIndex(step.stepIndex);

    triggerDecoyTripwire({
      decoyId: step.decoyId,
      sourceNodeId: step.sourceNode,
      targetNodeId: step.targetNode,
      attackerIp: step.attackerIp,
      tactic: step.tactic,
      technique: step.technique,
      title: step.title,
      summary: step.summary,
      severity: stepIndex >= 3 ? 'Critical' : 'High',
    });

    if (stepIndex + 1 < scenario.steps.length) {
      timerRef.current = setTimeout(() => {
        executeScenarioStep(scenario, stepIndex + 1);
      }, step.delayMs || 2000);
    } else {
      setIsRunning(false);
      soundFX.playContainmentSuccess();
    }
  };

  const handlePauseScenario = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
  };

  const handleResumeScenario = () => {
    const scenario = ATTACK_SCENARIOS.find(s => s.id === activeScenarioId);
    if (scenario && activeStepIndex <= scenario.steps.length) {
      setIsRunning(true);
      executeScenarioStep(scenario, activeStepIndex - 1);
    }
  };

  const handleResetScenario = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveScenarioId(null);
    setActiveStepIndex(0);
    setIsRunning(false);
    setActiveAttackPath([]);
  };

  // Full System Reset
  const handleResetSystem = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveScenarioId(null);
    setActiveStepIndex(0);
    setIsRunning(false);
    setActiveAttackPath([]);
    setSelectedNodeId(null);
    setInspectedDecoy(null);
    setThreatLevel('NORMAL');
    setNodes(INITIAL_NODES);
    setDecoys(INITIAL_DECOYS);
    try {
      localStorage.removeItem('cybershield_decoys');
    } catch (e) {}
    setIncidents([]);
    setBlocks([getGenesisBlock()]);
    soundFX.playRadarPing();
  };

  // Red-Team Attacker Terminal Command Dispatcher
  const handleExecuteTerminalCommand = (command, arg, raw) => {
    switch (command) {
      case 'scan': {
        const targetIp = arg || '198.51.100.2';
        const targetNode = nodes.find(n => n.ip === targetIp || n.id.includes(targetIp)) || nodes[0];

        triggerDecoyTripwire({
          decoyId: null,
          sourceNodeId: 'node-edge',
          targetNodeId: targetNode.id,
          attackerIp: '194.26.29.112',
          tactic: 'Reconnaissance',
          technique: 'T1595 (Active Scanning)',
          title: `Port Scan Detected on ${targetNode.name}`,
          summary: `Port probe from 194.26.29.112 scanning ${targetNode.ip}. Identified open ports: ${targetNode.services.join(', ')}.`,
          severity: 'Medium',
        });

        return [
          `Starting Nmap scan on ${targetNode.ip}...`,
          `Host is up (0.0024s latency).`,
          `PORT     STATE SERVICE`,
          `22/tcp   open  ssh`,
          `80/tcp   open  http`,
          `2222/tcp open  honey-ssh [CYBERSHIELD CANARY]`,
          `Nmap done: 1 IP address scanned in 1.42 seconds.`,
          `[!] ALERT: Decoy sensor triggered on ${targetNode.name}. Evidence block mined.`,
        ];
      }

      case 'cat':
      case 'read': {
        const targetFile = arg || 'prod-payment-gateway.env';
        const decoy = decoys.find(d => d.name.toLowerCase().includes(targetFile.toLowerCase())) || decoys[1];

        triggerDecoyTripwire({
          decoyId: decoy.id,
          sourceNodeId: decoy.nodeId,
          targetNodeId: decoy.nodeId,
          attackerIp: '194.26.29.112',
          tactic: 'Credential Access',
          technique: 'T1552 (Credentials in Files)',
          title: `Honeyfile Read: ${decoy.name}`,
          summary: `Unauthorized process executed "cat ${decoy.name}". Canary token ${decoy.canaryToken} fired!`,
          severity: 'High',
        });

        return [
          `=== DISPLAYING CONTENTS OF ${decoy.name} ===`,
          decoy.previewContent || 'DATABASE_URL=postgres://root:honey99@10.0.3.12:5432/corp',
          `[!] CRITICAL: Canary token [${decoy.canaryToken}] pinged SOC command center.`,
        ];
      }

      case 'download':
      case 'get': {
        const targetDoc = arg || 'Q4_Executive_Payroll_Bonus.xlsx';
        const decoy = decoys.find(d => d.name.toLowerCase().includes(targetDoc.toLowerCase())) || decoys[0];

        triggerDecoyTripwire({
          decoyId: decoy.id,
          sourceNodeId: 'node-workstation',
          targetNodeId: 'node-workstation',
          attackerIp: '194.26.29.112',
          tactic: 'Exfiltration',
          technique: 'T1083 (File Discovery & Canary Beacon)',
          title: `Canary Honeyfile Exfiltrated: ${decoy.name}`,
          summary: `Attacker downloaded "${decoy.name}". Embedded macro DNS webhook triggered immediate incident report.`,
          severity: 'Critical',
        });

        return [
          `Connecting to file host... 200 OK`,
          `Downloading ${decoy.name} [1.4 MB]... 100%`,
          `[!] CANARY BEACON FIRED: http://canary.cyberdeception.net/p8812 accessed!`,
          `[!] SOC Defense response: Workstation #42 placed in micro-segmentation queue.`,
        ];
      }

      case 'use-cred':
      case 'auth': {
        const credUser = arg || 'DOMAIN\\svc_backup_admin';
        const decoy = decoys.find(d => d.name.includes('svc_backup_admin')) || decoys[4];

        triggerDecoyTripwire({
          decoyId: decoy.id,
          sourceNodeId: 'node-workstation',
          targetNodeId: 'node-ad',
          attackerIp: '194.26.29.112',
          tactic: 'Credential Access',
          technique: 'T1558 (Kerberoasting / AS-REP Roasting)',
          title: `Decoy Honeytoken Authenticated: ${credUser}`,
          summary: `Kerberos ticket requested for fake account "${credUser}". Account has zero legitimate use; guaranteed intruder presence.`,
          severity: 'Critical',
        });

        return [
          `Submitting Kerberos TGS request for ${credUser}...`,
          `Kerberos Auth Response: SUCCESS (Ticket Granted: 0x77A1)`,
          `[!] TRIPWIRE FIRED: Fake service account accessed!`,
          `[!] Intruder IP 194.26.29.112 flagged with 100% certainty.`,
        ];
      }

      case 'ssh': {
        triggerDecoyTripwire({
          decoyId: 'decoy-endp-01',
          sourceNodeId: 'node-ad',
          targetNodeId: 'node-bastion',
          attackerIp: '194.26.29.112',
          tactic: 'Lateral Movement',
          technique: 'T1021.004 (Remote Services: SSH Honeypot)',
          title: `Intruder Trapped in Decoy Bastion Honeynet`,
          summary: `Attacker connected via SSH. CyberShield transparently trapped session in isolated sandbox on 10.0.4.99.`,
          severity: 'Critical',
        });

        return [
          `OpenSSH_8.9p1 Ubuntu-3ubuntu0.1`,
          `Password: ********`,
          `Welcome to Bastion Jump Server (10.0.4.99)`,
          `Last login: Sun Oct 25 11:42:19 2026 from 194.26.29.112`,
          `[!] ALERT: Connection trapped inside CyberShield Honeynet Sandbox! All keystrokes recorded.`,
        ];
      }

      case 'exfil': {
        triggerDecoyTripwire({
          decoyId: 'decoy-endp-02',
          sourceNodeId: 'node-cloud',
          targetNodeId: 'node-cloud',
          attackerIp: '45.154.255.89',
          tactic: 'Exfiltration',
          technique: 'T1530 (Cloud Storage Object Exfiltration)',
          title: `Decoy S3 Data Lake Exfiltration Blocked`,
          summary: `Unauthorized s3:GetObject API invocation on "s3://corp-backups-q4". Canary alarm blacklisted source IP.`,
          severity: 'Critical',
        });

        return [
          `aws s3 sync s3://corp-backups-q4/ ./loot`,
          `[!] ACCESS DENIED: Canary IAM Key revoked by CloudTrail GuardDuty rule.`,
          `[!] Incident hash anchored into DecoyGrid blockchain block #${blocks.length}.`,
        ];
      }

      default:
        return [
          `Command not recognized: "${raw}".`,
          `Type "help" to display list of available exploits and reconnaissance commands.`,
        ];
    }
  };

  // Deploy New Dynamic Decoy Asset
  const handleDeployDecoy = (newDecoy) => {
    setDecoys(prev => [newDecoy, ...prev]);
    soundFX.playBlockMinted();

    // Update node decoy count dynamically
    setNodes(prev =>
      prev.map(n => {
        if (n.id === newDecoy.nodeId) {
          return { ...n, decoysCount: (n.decoysCount || 0) + 1 };
        }
        return n;
      })
    );
  };

  const handleDeleteDecoy = (decoyId) => {
    const decoy = decoys.find(d => d.id === decoyId);
    if (decoy) {
      setNodes(prev =>
        prev.map(n => {
          if (n.id === decoy.nodeId) {
            return { ...n, decoysCount: Math.max(0, (n.decoysCount || 1) - 1) };
          }
          return n;
        })
      );
    }
    setDecoys(prev => prev.filter(d => d.id !== decoyId));
  };

  // Tamper & Anti-Forensics Simulation
  const handleTamperIncident = (incidentId) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            attackerIp: '127.0.0.1 (MODIFIED BY ADVERSARY)',
            summary: '[ALTERED LOG] Normal administrator routine backup completed successfully.',
            isTampered: true,
          };
        }
        return inc;
      })
    );
  };

  const handleRestoreIncident = (incidentId) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            attackerIp: '194.26.29.112',
            summary: `Suspicious interaction detected touching decoy asset. Verified from immutable on-chain block.`,
            isTampered: false,
          };
        }
        return inc;
      })
    );
    soundFX.playContainmentSuccess();
  };

  return (
    <div className="app-container">
      {/* Top SOC Navigation Header */}
      <Header
        activeScenario={activeScenarioId}
        onLaunchScenario={handleLaunchScenario}
        onResetSystem={handleResetSystem}
        onOpenReport={() => setIsReportModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        blockchainHeight={blocks.length - 1}
        threatLevel={threatLevel}
        activeIncidentsCount={incidents.length}
      />

      {/* Main Workspace Layout */}
      <main className="main-content">
        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            onClick={() => setActiveTab('TOPOLOGY')}
            className={`nav-tab-item ${activeTab === 'TOPOLOGY' ? 'active' : ''}`}
          >
            <Network size={16} />
            <span>Network Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('DECOYS')}
            className={`nav-tab-item ${activeTab === 'DECOYS' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Decoy Asset Studio</span>
            <span className="tab-badge">{decoys.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`nav-tab-item ${activeTab === 'SIMULATOR' ? 'active' : ''}`}
          >
            <Play size={16} />
            <span>Kill-Chain Simulator</span>
            {activeScenarioId && <span className="tab-badge" style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca' }}>ACTIVE</span>}
          </button>

          <button
            onClick={() => setActiveTab('TERMINAL')}
            className={`nav-tab-item ${activeTab === 'TERMINAL' ? 'active' : ''}`}
          >
            <Terminal size={16} />
            <span>Red-Team Console</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`nav-tab-item ${activeTab === 'TIMELINE' ? 'active' : ''}`}
          >
            <History size={16} />
            <span>Incident Timeline</span>
            <span className="tab-badge">{incidents.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('BLOCKCHAIN')}
            className={`nav-tab-item ${activeTab === 'BLOCKCHAIN' ? 'active' : ''}`}
          >
            <Blocks size={16} />
            <span>Blockchain Ledger</span>
            <span className="tab-badge">#{blocks.length - 1}</span>
          </button>
        </nav>

        {/* Tab Content Display */}
        {activeTab === 'TOPOLOGY' && (
          <NetworkTopology
            nodes={nodes}
            edges={edges}
            activeAttackPath={activeAttackPath}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            decoys={decoys}
            onViewDecoy={setInspectedDecoy}
          />
        )}

        {activeTab === 'DECOYS' && (
          <DecoyManager
            decoys={decoys}
            nodes={nodes}
            onDeployDecoy={handleDeployDecoy}
            onDeleteDecoy={handleDeleteDecoy}
            onViewDecoy={setInspectedDecoy}
            onTestTripwire={(decoy) => {
              triggerDecoyTripwire({
                decoyId: decoy.id,
                sourceNodeId: decoy.nodeId,
                targetNodeId: decoy.nodeId,
                title: `Manual Tripwire Test: ${decoy.name}`,
                summary: `Operator triggered tripwire simulation on ${decoy.name} (${decoy.tripwireType}).`,
                severity: 'High',
              });
            }}
          />
        )}

        {activeTab === 'SIMULATOR' && (
          <AttackSimulator
            scenarios={ATTACK_SCENARIOS}
            activeScenarioId={activeScenarioId}
            activeStepIndex={activeStepIndex}
            isRunning={isRunning}
            onStartScenario={handleLaunchScenario}
            onPauseScenario={handlePauseScenario}
            onResumeScenario={handleResumeScenario}
            onResetScenario={handleResetScenario}
          />
        )}

        {activeTab === 'TERMINAL' && (
          <AttackerTerminal onExecuteCommand={handleExecuteTerminalCommand} />
        )}

        {activeTab === 'TIMELINE' && (
          <IncidentTimeline
            incidents={incidents}
            activePlaybackIndex={activePlaybackIndex}
            onPlaybackStep={setActivePlaybackIndex}
            onResetTimeline={() => setActivePlaybackIndex(0)}
            onInspectIncident={(inc) => {
              setActiveTab('BLOCKCHAIN');
            }}
          />
        )}

        {activeTab === 'BLOCKCHAIN' && (
          <BlockchainLedger
            blocks={blocks}
            incidents={incidents}
            onTamperIncident={handleTamperIncident}
            onRestoreIncident={handleRestoreIncident}
          />
        )}
      </main>

      {/* Decoy Inspection Modal */}
      {inspectedDecoy && (
        <DecoyDetailModal
          decoy={inspectedDecoy}
          onClose={() => setInspectedDecoy(null)}
          onTestTripwire={(decoy) => {
            triggerDecoyTripwire({
              decoyId: decoy.id,
              sourceNodeId: decoy.nodeId,
              targetNodeId: decoy.nodeId,
              title: `Simulated Intrusion on ${decoy.name}`,
              summary: `Suspicious reading of decoy file ${decoy.name} triggered canary beacon.`,
              severity: 'Critical',
            });
          }}
        />
      )}

      {/* Executive Incident Report Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        incidents={incidents}
        blocks={blocks}
        decoys={decoys}
        threatLevel={threatLevel}
      />
    </div>
  );
}
