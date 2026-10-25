import React, { useState } from 'react';
import { 
  Server, 
  Laptop, 
  Cloud, 
  KeyRound, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Crosshair, 
  Lock,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';

export default function NetworkTopology({
  nodes,
  edges,
  activeAttackPath = [],
  selectedNodeId,
  onSelectNode,
  decoys,
  onViewDecoy,
}) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Helper to get icon for node
  const getNodeIcon = (node) => {
    switch (node.id) {
      case 'node-edge':
        return <Radio size={20} color="#0284c7" />;
      case 'node-workstation':
        return <Laptop size={20} color="#2563eb" />;
      case 'node-cloud':
        return <Cloud size={20} color="#7c3aed" />;
      case 'node-ad':
        return <KeyRound size={20} color="#d97706" />;
      case 'node-db':
        return <Database size={20} color="#059669" />;
      case 'node-bastion':
        return <ShieldCheck size={20} color="#dc2626" />;
      default:
        return <Server size={20} color="#0284c7" />;
    }
  };

  // Helper to determine node border/glow color based on status
  const getNodeStatusStyle = (status) => {
    switch (status) {
      case 'breached':
        return {
          border: 'var(--cyber-crimson)',
          glow: 'rgba(220, 38, 38, 0.3)',
          badge: 'cyber-badge-crimson',
          text: 'BREACHED',
        };
      case 'probed':
        return {
          border: 'var(--cyber-amber)',
          glow: 'rgba(217, 119, 6, 0.25)',
          badge: 'cyber-badge-amber',
          text: 'PROBED',
        };
      case 'quarantined':
        return {
          border: 'var(--cyber-violet)',
          glow: 'rgba(109, 40, 217, 0.25)',
          badge: 'cyber-badge-purple',
          text: 'QUARANTINED',
        };
      default:
        return {
          border: '#0284c7',
          glow: 'rgba(2, 132, 199, 0.15)',
          badge: 'cyber-badge-emerald',
          text: 'ARMED',
        };
    }
  };

  const getNode = (id) => nodes.find(n => n.id === id);

  const isAttackEdge = (edge) => {
    if (!activeAttackPath || activeAttackPath.length < 2) return false;
    for (let i = 0; i < activeAttackPath.length - 1; i++) {
      if (
        (activeAttackPath[i] === edge.from && activeAttackPath[i + 1] === edge.to) ||
        (activeAttackPath[i] === edge.to && activeAttackPath[i + 1] === edge.from)
      ) {
        return true;
      }
    }
    return false;
  };

  const selectedNode = getNode(selectedNodeId);
  const selectedNodeDecoys = decoys.filter(d => d.nodeId === selectedNodeId);

  return (
    <div className="glass-panel" style={{ padding: 20 }}>
      {/* Topology Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 6,
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #bae6fd',
          }}>
            <Crosshair size={18} color="#0284c7" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: 'var(--text-primary)' }}>SIMULATED NETWORK TOPOLOGY</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              LIVE SENSOR GRID • DYNAMIC DECOY ENDPOINTS & LATERAL MOVEMENT MAPPING
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: 10 }}>
            ● ARMED DECOY
          </span>
          <span className="cyber-badge cyber-badge-amber" style={{ fontSize: 10 }}>
            ▲ PROBED
          </span>
          <span className="cyber-badge cyber-badge-crimson" style={{ fontSize: 10 }}>
            ✖ BREACHED / HONEYTRIP
          </span>
          <span className="cyber-badge cyber-badge-purple" style={{ fontSize: 10 }}>
            🔒 QUARANTINED
          </span>
        </div>
      </div>

      {/* Main Grid: SVG Map on Left, Node Details on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedNode ? '1fr 340px' : '1fr',
        gap: 20,
        transition: 'grid-template-columns var(--transition-normal)',
      }}>
        {/* SVG Network Map */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: 520,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.02)',
        }}>
          {/* Subtle Radar Sweep Circles */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 480,
            height: 480,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(2, 132, 199, 0.12)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 720,
            height: 720,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(2, 132, 199, 0.08)',
            pointerEvents: 'none',
          }} />

          {/* SVG Canvas for Edges and Animated Attack Vectors */}
          <svg
            viewBox="0 0 960 560"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <linearGradient id="edgeNormalGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="edgeAttackGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="50%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>

            {/* Network Connections (Edges) */}
            {edges.map((edge, idx) => {
              const fromNode = getNode(edge.from);
              const toNode = getNode(edge.to);
              if (!fromNode || !toNode) return null;

              const isAttacking = isAttackEdge(edge);

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isAttacking ? 'url(#edgeAttackGradLight)' : '#cbd5e1'}
                    strokeWidth={isAttacking ? 3.5 : 1.8}
                    strokeDasharray={isAttacking ? '6,4' : '4,4'}
                    style={{
                      animation: isAttacking ? 'laserPulse 0.8s linear infinite' : undefined,
                    }}
                  />

                  {/* Midpoint Label */}
                  <rect
                    x={(fromNode.x + toNode.x) / 2 - 45}
                    y={(fromNode.y + toNode.y) / 2 - 16}
                    width={90}
                    height={18}
                    rx={4}
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth={1}
                  />
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 4}
                    fill={isAttacking ? '#dc2626' : '#64748b'}
                    fontSize={9}
                    fontWeight={600}
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes as SVG Groups */}
            {nodes.map((node) => {
              const statusStyle = getNodeStatusStyle(node.status);
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isAttackerActive = activeAttackPath.includes(node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectNode(node.id === selectedNodeId ? null : node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Outer Pulsing Ring for Breached / Active Nodes */}
                  {(node.status === 'breached' || isAttackerActive) && (
                    <circle
                      r={36}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth={2}
                      opacity={0.8}
                      style={{
                        animation: 'pulseAlertLight 1.2s infinite ease-in-out',
                      }}
                    />
                  )}

                  {/* Node Outer Circle */}
                  <circle
                    r={26}
                    fill="#ffffff"
                    stroke={isSelected ? '#0284c7' : statusStyle.border}
                    strokeWidth={isSelected ? 3 : 2}
                    filter="drop-shadow(0 2px 5px rgba(15, 23, 42, 0.12))"
                    style={{
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                  />

                  {/* Decoy Count Indicator Dot */}
                  <circle
                    cx={16}
                    cy={-16}
                    r={8}
                    fill="#f0f9ff"
                    stroke="#0284c7"
                    strokeWidth={1.5}
                  />
                  <text
                    x={16}
                    y={-13}
                    fill="#0284c7"
                    fontSize={10}
                    fontWeight="bold"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {node.decoysCount}
                  </text>

                  {/* Status Indicator Icon */}
                  <foreignObject x={-12} y={-12} width={24} height={24}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}>
                      {node.status === 'breached' ? (
                        <AlertTriangle size={18} color="#dc2626" />
                      ) : (
                        getNodeIcon(node)
                      )}
                    </div>
                  </foreignObject>

                  {/* Node Title & IP Label below */}
                  <text
                    x={0}
                    y={40}
                    fill={isSelected ? '#0284c7' : '#0f172a'}
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="var(--font-display)"
                    textAnchor="middle"
                    letterSpacing="0.04em"
                  >
                    {node.name}
                  </text>
                  <text
                    x={0}
                    y={54}
                    fill="#64748b"
                    fontSize={10}
                    fontWeight={500}
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {node.ip}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick HUD Overlay at Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: '6px 12px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', boxShadow: '0 0 6px rgba(5, 150, 105, 0.5)' }} />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                ACTIVE HONEYNET SENSORS: 6
              </span>
            </div>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 600 }}>
              DYNAMIC DECOYS DEPLOYED: {decoys.length}
            </span>
          </div>
        </div>

        {/* Node Inspector Drawer (Right Panel) */}
        {selectedNode && (
          <div className="glass-panel" style={{
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            animation: 'modalIn 0.2s ease',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: 10,
            }}>
              <div>
                <span className={`cyber-badge ${getNodeStatusStyle(selectedNode.status).badge}`}>
                  {getNodeStatusStyle(selectedNode.status).text}
                </span>
                <h3 style={{ fontSize: 16, marginTop: 4, color: 'var(--text-primary)' }}>
                  {selectedNode.name}
                </h3>
              </div>
              <button
                onClick={() => onSelectNode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {/* Node Metadata Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>IP / URI:</span>
                <span className="mono" style={{ color: '#0284c7', fontWeight: 600 }}>{selectedNode.ip}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Network Zone:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedNode.zone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>OS Environment:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{selectedNode.os}</span>
              </div>
            </div>

            {/* Running Services */}
            <div>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>
                ACTIVE SERVICES & PORTS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {selectedNode.services.map((svc, i) => (
                  <span key={i} className="cyber-badge" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                    {svc}
                  </span>
                ))}
              </div>
            </div>

            {/* Installed Decoys on this Node */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#0284c7', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <Layers size={13} />
                INSTALLED DECOY ASSETS ({selectedNodeDecoys.length})
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                {selectedNodeDecoys.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No decoys configured on this node.</p>
                ) : (
                  selectedNodeDecoys.map((decoy) => (
                    <div
                      key={decoy.id}
                      onClick={() => onViewDecoy(decoy)}
                      style={{
                        padding: '9px 11px',
                        background: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0284c7';
                        e.currentTarget.style.background = '#f0f9ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {decoy.name}
                        </span>
                        <span className={`cyber-badge ${decoy.triggersCount > 0 ? 'cyber-badge-crimson' : 'cyber-badge-emerald'}`} style={{ fontSize: 9 }}>
                          {decoy.triggersCount > 0 ? `${decoy.triggersCount} TRIPPED` : 'ARMED'}
                        </span>
                      </div>
                      <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {decoy.type} • Realism: {decoy.realismScore}%
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
