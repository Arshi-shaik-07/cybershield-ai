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
        return <Radio size={22} color="var(--cyber-cyan)" />;
      case 'node-workstation':
        return <Laptop size={22} color="#60a5fa" />;
      case 'node-cloud':
        return <Cloud size={22} color="#c084fc" />;
      case 'node-ad':
        return <KeyRound size={22} color="#fbbf24" />;
      case 'node-db':
        return <Database size={22} color="#34d399" />;
      case 'node-bastion':
        return <ShieldCheck size={22} color="#f43f5e" />;
      default:
        return <Server size={22} color="var(--cyber-cyan)" />;
    }
  };

  // Helper to determine node border/glow color based on status
  const getNodeStatusStyle = (status) => {
    switch (status) {
      case 'breached':
        return {
          border: 'var(--cyber-crimson)',
          glow: 'rgba(239, 68, 68, 0.45)',
          badge: 'cyber-badge-crimson',
          text: 'BREACHED',
        };
      case 'probed':
        return {
          border: 'var(--cyber-amber)',
          glow: 'rgba(245, 158, 11, 0.4)',
          badge: 'cyber-badge-amber',
          text: 'PROBED',
        };
      case 'quarantined':
        return {
          border: 'var(--cyber-violet)',
          glow: 'rgba(168, 85, 247, 0.4)',
          badge: 'cyber-badge-purple',
          text: 'QUARANTINED',
        };
      default:
        return {
          border: 'var(--border-strong)',
          glow: 'rgba(0, 240, 255, 0.2)',
          badge: 'cyber-badge-emerald',
          text: 'ARMED',
        };
    }
  };

  // Find node by ID
  const getNode = (id) => nodes.find(n => n.id === id);

  // Check if an edge is currently part of the active attack vector
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
            width: 32,
            height: 32,
            borderRadius: 6,
            background: 'rgba(0, 240, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--cyber-cyan)',
          }}>
            <Crosshair size={18} color="var(--cyber-cyan)" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, color: '#fff' }}>SIMULATED NETWORK TOPOLOGY</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              LIVE SENSOR GRID • INTERACTIVE DECOY ENDPOINTS & LATERAL MOVEMENT MAPPING
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
          background: 'radial-gradient(ellipse at center, rgba(14, 25, 48, 0.7) 0%, rgba(6, 9, 18, 0.95) 100%)',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}>
          {/* Subtle Radar Sweep Animation in background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 480,
            height: 480,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(0, 240, 255, 0.08)',
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
            border: '1px dashed rgba(0, 240, 255, 0.04)',
            pointerEvents: 'none',
          }} />

          {/* SVG Canvas for Edges and Animated Attack Vectors */}
          <svg
            viewBox="0 0 960 560"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="edgeNormalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0.2)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.25)" />
              </linearGradient>
              <linearGradient id="edgeAttackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2a5f" />
                <stop offset="50%" stopColor="#ffaa00" />
                <stop offset="100%" stopColor="#ff2a5f" />
              </linearGradient>

              {/* Glowing Filters */}
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Network Connections (Edges) */}
            {edges.map((edge, idx) => {
              const fromNode = getNode(edge.from);
              const toNode = getNode(edge.to);
              if (!fromNode || !toNode) return null;

              const isAttacking = isAttackEdge(edge);

              return (
                <g key={`edge-${idx}`}>
                  {/* Base Wire */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isAttacking ? 'url(#edgeAttackGrad)' : 'rgba(0, 240, 255, 0.18)'}
                    strokeWidth={isAttacking ? 3.5 : 1.5}
                    strokeDasharray={isAttacking ? '6,4' : '4,4'}
                    filter={isAttacking ? 'url(#laserGlow)' : undefined}
                    style={{
                      animation: isAttacking ? 'laserPulse 0.8s linear infinite' : undefined,
                    }}
                  />

                  {/* Midpoint Label */}
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 6}
                    fill={isAttacking ? '#ffaa00' : 'rgba(148, 163, 184, 0.6)'}
                    fontSize={9}
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
                      r={38}
                      fill="none"
                      stroke="var(--cyber-crimson)"
                      strokeWidth={1.5}
                      opacity={0.8}
                      style={{
                        animation: 'pulseAlert 1.2s infinite ease-in-out',
                      }}
                    />
                  )}

                  {/* Node Outer Circle */}
                  <circle
                    r={28}
                    fill="rgba(11, 18, 36, 0.95)"
                    stroke={isSelected ? 'var(--cyber-cyan)' : statusStyle.border}
                    strokeWidth={isSelected ? 2.5 : 1.8}
                    filter={isSelected || isAttackerActive ? 'url(#laserGlow)' : undefined}
                    style={{
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                  />

                  {/* Decoy Count Indicator Dot */}
                  <circle
                    cx={18}
                    cy={-18}
                    r={9}
                    fill="rgba(0, 240, 255, 0.2)"
                    stroke="var(--cyber-cyan)"
                    strokeWidth={1}
                  />
                  <text
                    x={18}
                    y={-15}
                    fill="var(--cyber-cyan)"
                    fontSize={10}
                    fontWeight="bold"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {node.decoysCount}
                  </text>

                  {/* Status Indicator Icon / Glyph */}
                  <foreignObject x={-14} y={-14} width={28} height={28}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}>
                      {node.status === 'breached' ? (
                        <AlertTriangle size={18} color="var(--cyber-crimson)" />
                      ) : (
                        getNodeIcon(node)
                      )}
                    </div>
                  </foreignObject>

                  {/* Node Title & IP Label below */}
                  <text
                    x={0}
                    y={42}
                    fill={isSelected ? 'var(--cyber-cyan)' : '#f8fafc'}
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="var(--font-display)"
                    textAnchor="middle"
                    letterSpacing="0.05em"
                  >
                    {node.name}
                  </text>
                  <text
                    x={0}
                    y={56}
                    fill="var(--text-muted)"
                    fontSize={10}
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
            background: 'rgba(8, 14, 26, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: '6px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyber-emerald)', boxShadow: '0 0 6px var(--cyber-emerald)' }} />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                ACTIVE HONEYNET SENSORS: 6
              </span>
            </div>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)' }}>
              DECOYS DEPLOYED: {decoys.length}
            </span>
          </div>
        </div>

        {/* Node Inspector Drawer (Right Panel) */}
        {selectedNode && (
          <div className="glass-panel" style={{
            padding: 16,
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
                <h3 style={{ fontSize: 16, marginTop: 4, color: '#fff' }}>
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
                <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{selectedNode.ip}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Network Zone:</span>
                <span style={{ color: 'var(--text-primary)' }}>{selectedNode.zone}</span>
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
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
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
                        padding: '8px 10px',
                        background: 'rgba(8, 14, 28, 0.7)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--cyber-cyan)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
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
