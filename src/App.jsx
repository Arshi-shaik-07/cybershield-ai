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
  Radio,
  Bot
} from 'lucide-react';

const AUTONOMOUS_THREAT_POOL = [
  {
    sourceNode: 'node-edge',
    targetNode: 'node-bastion',
    attackerIp: '185.220.101.5',
    tactic: 'Initial Access',
    technique: 'T1190 (Exploit Public-Facing Application)',
    title: 'Autonomous Detection: External SSH Port 2222 Honeypot Probe',
    summary: 'Adversary bot 185.220.101.5 probed honeypot SSH daemon on 10.0.4.99. Session transparently trapped in isolated sandbox and logged to blockchain.',
    severity: 'High',
  },
  {
    sourceNode: 'node-workstation',
    targetNode: 'node-ad',
    attackerIp: '194.26.29.112',
    tactic: 'Credential Access',
    technique: 'T1558.003 (Kerberoasting / AS-REP Roasting)',
    title: 'Autonomous Detection: Decoy Domain Admin Account Queried',
    summary: 'Unauthorized Kerberos ticket request detected targeting fake admin service account. Zero legitimate usage exists; guaranteed intruder presence.',
    severity: 'Critical',
  },
  {
    sourceNode: 'node-cloud',
    targetNode: 'node-cloud',
    attackerIp: '45.154.255.89',
    tactic: 'Exfiltration',
    technique: 'T1530 (Cloud Storage Object Exfiltration)',
    title: 'Autonomous Detection: Decoy S3 Data Lake Enumerated',
    summary: 'Automated crawler invoked ListObjects on decoy bucket s3://corp-backups-q4. Cloud canary guard revoked IAM permissions within 110ms.',
    severity: 'Critical',
  },
  {
    sourceNode: 'node-workstation',
    targetNode: 'node-workstation',
    attackerIp: '10.0.1.42',
    tactic: 'Discovery',
    technique: 'T1083 (File and Directory Discovery)',
    title: 'Autonomous Detection: Decoy Honeyfile Beacon Fired',
    summary: 'Suspicious background process opened confidential canary document. Embedded DNS webhook signaled immediate intrusion alert to SOC.',
    severity: 'High',
  },
  {
    sourceNode: 'node-ad',
    targetNode: 'node-db',
    attackerIp: '194.26.29.112',
    tactic: 'Lateral Movement',
    technique: 'T1021.002 (SMB/Windows Admin Shares)',
    title: 'Autonomous Detection: Lateral Pivot Intercepted',
    summary: 'Intruder attempted lateral jump toward Core Financial Database using harvested decoy key. Autonomous sandbox rerouted connection.',
    severity: 'Critical',
  },
  {
    sourceNode: 'node-edge',
    targetNode: 'node-cloud',
    attackerIp: '91.240.118.22',
    tactic: 'Credential Access',
    technique: 'T1552.001 (Credentials in Files)',
    title: 'Autonomous Detection: Poisoned API Token Used',
    summary: 'Canary Stripe API secret key used in unauthorized API Gateway request from external proxy. Request sinkholed and sealed on blockchain.',
    severity: 'High',
  },
];

export default function App() {
  // Navigation Tabs: 'TOPOLOGY', 'DECOYS', 'SIMULATOR', 'TERMINAL', 'TIMELINE', 'BLOCKCHAIN'
  const [activeTab, setActiveTab] = useState('SIMULATOR');

  // Network & Decoy State with static authentic owner-inserted assets (NO demo records)
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [decoys, setDecoys] = useState(() => {
    try {
      const saved = localStorage.getItem('cybershield_owner_records_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_DECOYS;
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

  // Autonomous Threat Detection Engine State (AUTOMATIC FAST FRAUD IDENTIFICATION)
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [detectionSpeed, setDetectionSpeed] = useState(2500);
  const [autoDetectedCount, setAutoDetectedCount] = useState(0);
  const [lastAutoDetection, setLastAutoDetection] = useState(null);
  const [recentAutoIntrusions, setRecentAutoIntrusions] = useState([]);
  const [autoCycleScenarios, setAutoCycleScenarios] = useState(true);
  const autoCycleScenariosRef = useRef(true);
  const autoThreatIndexRef = useRef(0);

  // Forensics & Blockchain State
  const [incidents, setIncidents] = useState([]);
  const [blocks, setBlocks] = useState(() => [getGenesisBlock()]);
  const [activePlaybackIndex, setActivePlaybackIndex] = useState(0);
  const [threatLevel, setThreatLevel] = useState('NORMAL');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Derive dynamic decoy counts per node
  const nodesWithDynamicCounts = nodes.map(n => ({
    ...n,
    decoysCount: decoys.filter(d => d.nodeId === n.id).length,
  }));

  // Persist owner-inserted decoys changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cybershield_owner_records_v4', JSON.stringify(decoys));
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
    isAutonomous = false,
  }) => {
    if (isAutonomous) {
      soundFX.playRadarPing();
    } else {
      soundFX.playAlarmAlert();
    }

    let triggeredDecoyName = 'Decoy Asset';
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

    if (severity === 'Critical') setThreatLevel('CRITICAL');
    else if (threatLevel !== 'CRITICAL') setThreatLevel('HIGH');

    if (sourceNodeId && targetNodeId) {
      setActiveAttackPath([sourceNodeId, targetNodeId]);
    }

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

  // AUTONOMOUS CONTINUOUS FRAUD & INTRUSION DETECTION ENGINE (AUTO-PILOT)
  useEffect(() => {
    if (!autonomousMode || isRunning) return;

    const interval = setInterval(() => {
      const idx = autoThreatIndexRef.current % AUTONOMOUS_THREAT_POOL.length;
      autoThreatIndexRef.current += 1;
      const baseThreat = AUTONOMOUS_THREAT_POOL[idx];

      let targetDecoyId = null;
      let targetTitle = baseThreat.title;
      let targetSummary = baseThreat.summary;

      // If owner has inserted custom decoys, prioritize hunting against owner assets!
      if (decoys.length > 0) {
        const ownerDecoy = decoys[Math.floor(Math.random() * decoys.length)];
        targetDecoyId = ownerDecoy.id;
        targetTitle = `Autonomous Detection: Decoy "${ownerDecoy.name}" Tripped`;
        targetSummary = `Autonomous sensor detected unauthorized access by ${baseThreat.attackerIp} touching owner-inserted asset "${ownerDecoy.name}" (${ownerDecoy.category}) on ${ownerDecoy.nodeId}. Zero false-positives confirmed.`;
      }

      triggerDecoyTripwire({
        decoyId: targetDecoyId,
        sourceNodeId: baseThreat.sourceNode,
        targetNodeId: baseThreat.targetNode,
        attackerIp: baseThreat.attackerIp,
        tactic: baseThreat.tactic,
        technique: baseThreat.technique,
        title: targetTitle,
        summary: targetSummary,
        severity: baseThreat.severity,
        isAutonomous: true,
      });

      setAutoDetectedCount(c => c + 1);

      const detectionEvent = {
        id: `auto-${Date.now()}`,
        timestamp: new Date().toISOString(),
        attackerIp: baseThreat.attackerIp,
        tactic: baseThreat.tactic,
        title: targetTitle,
        blockNumber: blocks.length,
      };

      setLastAutoDetection(detectionEvent);
      setRecentAutoIntrusions(prev => [detectionEvent, ...prev.slice(0, 4)]);
    }, detectionSpeed);

    return () => clearInterval(interval);
  }, [autonomousMode, isRunning, detectionSpeed, decoys]);

  // Automated Scenario Runner (for on-demand APT testing)
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

    const nodeDecoy = decoys.find(d => d.nodeId === step.targetNode) || decoys[0];

    triggerDecoyTripwire({
      decoyId: nodeDecoy ? nodeDecoy.id : null,
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
      }, 1100);
    } else {
      setIsRunning(false);
      soundFX.playContainmentSuccess();
      if (autoCycleScenariosRef.current) {
        timerRef.current = setTimeout(() => {
          if (!autoCycleScenariosRef.current) return;
          const currentIdx = ATTACK_SCENARIOS.findIndex(s => s.id === scenario.id);
          const nextIdx = (currentIdx + 1) % ATTACK_SCENARIOS.length;
          handleLaunchScenario(ATTACK_SCENARIOS[nextIdx].id);
        }, 1500);
      }
    }
  };

  // Auto-start scenario execution immediately on mount
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (autoCycleScenariosRef.current) {
        handleLaunchScenario(ATTACK_SCENARIOS[0].id);
      }
    }, 600);
    return () => clearTimeout(initTimer);
  }, []);

  const handleToggleAutoCycle = () => {
    const next = !autoCycleScenarios;
    setAutoCycleScenarios(next);
    autoCycleScenariosRef.current = next;
    if (next && !isRunning) {
      handleLaunchScenario(ATTACK_SCENARIOS[0].id);
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
    setAutoCycleScenarios(false);
    autoCycleScenariosRef.current = false;
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
    setIncidents([]);
    setBlocks([getGenesisBlock()]);
    setAutoDetectedCount(0);
    setRecentAutoIntrusions([]);
    soundFX.playRadarPing();
  };

  // Red-Team Attacker Terminal Command Dispatcher
  const handleExecuteTerminalCommand = (command, arg, raw) => {
    switch (command) {
      case 'scan': {
        const targetIp = arg || '198.51.100.2';
        const targetNode = nodes.find(n => n.ip === targetIp || n.id.includes(targetIp)) || nodes[0];
        const activeNodeDecoys = decoys.filter(d => d.nodeId === targetNode.id);

        triggerDecoyTripwire({
          decoyId: activeNodeDecoys[0]?.id || null,
          sourceNodeId: 'node-edge',
          targetNodeId: targetNode.id,
          attackerIp: '194.26.29.112',
          tactic: 'Reconnaissance',
          technique: 'T1595 (Active Scanning)',
          title: `Port Scan Detected on ${targetNode.name}`,
          summary: `Port probe from 194.26.29.112 scanning ${targetNode.ip}. Identified open services: ${targetNode.services.join(', ')}.`,
          severity: 'Medium',
        });

        return [
          `Starting Nmap scan on ${targetNode.ip}...`,
          `Host is up (0.0024s latency).`,
          `SERVICES RUNNING: ${targetNode.services.join(', ')}`,
          `DECOYS ARMED ON THIS NODE: ${activeNodeDecoys.length > 0 ? activeNodeDecoys.map(d => d.name).join(', ') : 'None inserted yet'}`,
          `[!] ALERT: Decoy sensor triggered on ${targetNode.name}. Evidence block mined to blockchain.`,
        ];
      }

      case 'cat':
      case 'read': {
        const searchName = arg ? arg.toLowerCase() : '';
        const decoy = decoys.find(d => d.name.toLowerCase().includes(searchName)) || decoys.find(d => d.category === 'Honeyfile');

        if (!decoy) {
          return [
            `Error: No decoy honeyfile found matching "${arg || 'file'}".`,
            `Please go to "Decoy Asset Studio" and insert a honeyfile first.`,
          ];
        }

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
          `=== DISPLAYING CONTENTS OF ${decoy.name} (Inserted by: ${decoy.insertedBy || 'Owner'}) ===`,
          decoy.previewContent || 'DATABASE_URL=postgres://root:honey99@10.0.3.12:5432/corp',
          `[!] CRITICAL: Canary token [${decoy.canaryToken}] pinged SOC command center.`,
        ];
      }

      case 'download':
      case 'get': {
        const decoy = decoys.find(d => d.category === 'Honeyfile') || decoys[0];

        if (!decoy) {
          return [
            `Error: No downloadable decoy file exists.`,
            `Please insert a decoy honeyfile in "Decoy Asset Studio" first.`,
          ];
        }

        triggerDecoyTripwire({
          decoyId: decoy.id,
          sourceNodeId: decoy.nodeId,
          targetNodeId: decoy.nodeId,
          attackerIp: '194.26.29.112',
          tactic: 'Exfiltration',
          technique: 'T1083 (File Discovery & Canary Beacon)',
          title: `Owner Decoy Exfiltrated: ${decoy.name}`,
          summary: `Attacker downloaded "${decoy.name}" (Inserted by: ${decoy.insertedBy || 'Owner'}). Canary webhook triggered instant alert.`,
          severity: 'Critical',
        });

        return [
          `Connecting to node... 200 OK`,
          `Downloading ${decoy.name} [${decoy.fileSize || '1.5 MB'}]... 100%`,
          `[!] CANARY BEACON FIRED: Webhook alert logged to SIEM!`,
          `[!] Blockchain block sealed with cryptographic proof.`,
        ];
      }

      case 'use-cred':
      case 'auth': {
        const decoy = decoys.find(d => d.category === 'Honeytoken') || decoys[0];

        if (!decoy) {
          return [
            `Error: No fake credentials currently deployed.`,
            `Please insert a fake credential (honeytoken) in "Decoy Asset Studio" first.`,
          ];
        }

        triggerDecoyTripwire({
          decoyId: decoy.id,
          sourceNodeId: 'node-workstation',
          targetNodeId: decoy.nodeId || 'node-ad',
          attackerIp: '194.26.29.112',
          tactic: 'Credential Access',
          technique: 'T1558 (Kerberoasting / AS-REP Roasting)',
          title: `Owner Honeytoken Authenticated: ${decoy.name}`,
          summary: `Authentication attempted using owner-inserted decoy "${decoy.name}". Instant 100% fidelity alert triggered.`,
          severity: 'Critical',
        });

        return [
          `Submitting authentication request for ${decoy.name}...`,
          `Auth Response: SUCCESS (Fake Token Granted: 0x77A1)`,
          `[!] TRIPWIRE FIRED: Owner-inserted decoy credential accessed!`,
          `[!] Intruder IP 194.26.29.112 flagged and recorded on-chain.`,
        ];
      }

      case 'ssh': {
        const decoy = decoys.find(d => d.category === 'Endpoint') || decoys[0];

        triggerDecoyTripwire({
          decoyId: decoy ? decoy.id : null,
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
          `Last login: ${new Date().toLocaleTimeString()} from 194.26.29.112`,
          `[!] ALERT: Connection trapped inside CyberShield Honeynet Sandbox! All keystrokes recorded.`,
        ];
      }

      case 'exfil': {
        triggerDecoyTripwire({
          decoyId: null,
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

  // Deploy New Dynamic Decoy Asset (Inserted by Owner or User)
  const handleDeployDecoy = (newDecoy) => {
    setDecoys(prev => [newDecoy, ...prev]);
    soundFX.playBlockMinted();
  };

  const handleDeleteDecoy = (decoyId) => {
    setDecoys(prev => prev.filter(d => d.id !== decoyId));
  };

  const handleClearAllDecoys = () => {
    setDecoys(INITIAL_DECOYS);
    try {
      localStorage.setItem('cybershield_owner_records_v4', JSON.stringify(INITIAL_DECOYS));
    } catch (e) {}
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
        autonomousMode={autonomousMode}
        onToggleAutonomous={() => setAutonomousMode(m => !m)}
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
            <Bot size={16} color={autonomousMode ? '#059669' : '#64748b'} />
            <span>Kill-Chain & Auto-Detection</span>
            <span className="tab-badge" style={{ color: autonomousMode ? '#059669' : '#64748b', background: autonomousMode ? '#ecfdf5' : '#f1f5f9' }}>
              {autonomousMode ? 'AUTO-ACTIVE' : 'PAUSED'}
            </span>
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
            nodes={nodesWithDynamicCounts}
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
            nodes={nodesWithDynamicCounts}
            onDeployDecoy={handleDeployDecoy}
            onDeleteDecoy={handleDeleteDecoy}
            onClearAllDecoys={handleClearAllDecoys}
            onViewDecoy={setInspectedDecoy}
            onTestTripwire={(decoy) => {
              triggerDecoyTripwire({
                decoyId: decoy.id,
                sourceNodeId: decoy.nodeId,
                targetNodeId: decoy.nodeId,
                title: `Manual Tripwire Test: ${decoy.name}`,
                summary: `Operator triggered tripwire simulation on ${decoy.name} (${decoy.tripwireType}) [Inserted by: ${decoy.insertedBy || 'Owner'}].`,
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
            autonomousMode={autonomousMode}
            onToggleAutonomous={() => setAutonomousMode(m => !m)}
            detectionSpeed={detectionSpeed}
            onChangeSpeed={(spd) => setDetectionSpeed(spd)}
            autoDetectedCount={autoDetectedCount}
            lastAutoDetection={lastAutoDetection}
            recentAutoIntrusions={recentAutoIntrusions}
            autoCycleScenarios={autoCycleScenarios}
            onToggleAutoCycle={handleToggleAutoCycle}
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
