import React, { useState } from 'react';
import { 
  FileText, 
  Key, 
  Server, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Flame, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Radio,
  FileSpreadsheet,
  Lock
} from 'lucide-react';

export default function DecoyManager({
  decoys,
  nodes,
  onDeployDecoy,
  onViewDecoy,
  onTestTripwire,
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a new decoy
  const [formData, setFormData] = useState({
    name: '',
    category: 'Honeyfile',
    nodeId: 'node-workstation',
    type: 'Canary Document',
    tripwireType: 'Embedded DNS Webhook Beacon',
    realismScore: 97,
    description: '',
    previewContent: '',
  });

  const filteredDecoys = decoys.filter(decoy => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'HONEYFILE' && decoy.category === 'Honeyfile') ||
      (activeFilter === 'HONEYTOKEN' && decoy.category === 'Honeytoken') ||
      (activeFilter === 'ENDPOINT' && decoy.category === 'Endpoint');

    const matchesSearch =
      decoy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decoy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decoy.tripwireType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getNodeName = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.name : nodeId;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newDecoy = {
      ...formData,
      id: `decoy-custom-${Date.now().toString(36)}`,
      fileSize: formData.category === 'Honeyfile' ? '2.1 MB' : 'N/A',
      canaryToken: `cnry-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Armed',
      triggersCount: 0,
      lastTriggered: null,
    };

    onDeployDecoy(newDecoy);
    setIsModalOpen(false);
    setFormData({
      name: '',
      category: 'Honeyfile',
      nodeId: 'node-workstation',
      type: 'Canary Document',
      tripwireType: 'Embedded DNS Webhook Beacon',
      realismScore: 97,
      description: '',
      previewContent: '',
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Honeyfile':
        return <FileSpreadsheet size={16} color="var(--cyber-cyan)" />;
      case 'Honeytoken':
        return <Key size={16} color="var(--cyber-amber)" />;
      case 'Endpoint':
        return <Server size={16} color="var(--cyber-violet)" />;
      default:
        return <FileText size={16} color="var(--cyber-cyan)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Decoys Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}>
        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>TOTAL DECOYS ARMED</span>
            <ShieldCheck size={18} color="var(--cyber-emerald)" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 8 }}>
            {decoys.length}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-emerald)', marginTop: 4 }}>
            100% SENSORS ACTIVE ACROSS 6 NODES
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>TRIPWIRE TRIGGERS</span>
            <Flame size={18} color="var(--cyber-crimson)" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--cyber-crimson)', marginTop: 8 }}>
            {decoys.reduce((sum, d) => sum + (d.triggersCount || 0), 0)}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-crimson)', marginTop: 4 }}>
            REAL-TIME INTRUSION ALARMS
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>AVG REALISM FIDELITY</span>
            <Sparkles size={18} color="var(--cyber-cyan)" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--cyber-cyan)', marginTop: 8 }}>
            {(decoys.reduce((sum, d) => sum + (d.realismScore || 95), 0) / decoys.length).toFixed(1)}%
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-cyan)', marginTop: 4 }}>
            SYNTHESIZED HEURISTIC CAMOUFLAGE
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>ACTION</span>
            <Plus size={18} color="var(--cyber-amber)" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cyber-btn cyber-btn-primary"
            style={{ width: '100%', marginTop: 8, padding: '10px 12px' }}
          >
            <Plus size={16} />
            <span>Deploy New Decoy</span>
          </button>
        </div>
      </div>

      {/* Main Decoy Inventory Panel */}
      <div className="glass-panel" style={{ padding: 20 }}>
        {/* Controls: Search & Category Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 18,
        }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'HONEYFILE', 'HONEYTOKEN', 'ENDPOINT'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`cyber-btn cyber-btn-sm ${activeFilter === f ? 'cyber-btn-primary' : ''}`}
                style={{ padding: '6px 14px' }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search decoy name, token, hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(8, 14, 28, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: '7px 10px 7px 32px',
                color: '#fff',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Decoys Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                <th style={{ padding: '10px 12px' }}>DECOY ASSET</th>
                <th style={{ padding: '10px 12px' }}>CATEGORY</th>
                <th style={{ padding: '10px 12px' }}>LOCATION NODE</th>
                <th style={{ padding: '10px 12px' }}>TRIPWIRE MECHANISM</th>
                <th style={{ padding: '10px 12px' }}>REALISM</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDecoys.map((decoy) => (
                <tr
                  key={decoy.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 240, 255, 0.06)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 240, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: 'rgba(0, 240, 255, 0.08)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {getCategoryIcon(decoy.category)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>
                          {decoy.name}
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          TOKEN: {decoy.canaryToken}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span className="cyber-badge" style={{ fontSize: 10 }}>
                      {decoy.category}
                    </span>
                  </td>

                  <td style={{ padding: '12px', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {getNodeName(decoy.nodeId)}
                  </td>

                  <td style={{ padding: '12px', fontSize: 12, color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {decoy.tripwireType}
                  </td>

                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 48,
                        height: 6,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${decoy.realismScore}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--cyber-cyan), var(--cyber-emerald))',
                        }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--cyber-emerald)' }}>
                        {decoy.realismScore}%
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span className={`cyber-badge ${decoy.triggersCount > 0 ? 'cyber-badge-crimson' : 'cyber-badge-emerald'}`}>
                      {decoy.triggersCount > 0 ? `TRIPPED (${decoy.triggersCount})` : 'ARMED'}
                    </span>
                  </td>

                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <button
                        onClick={() => onViewDecoy(decoy)}
                        className="cyber-btn cyber-btn-sm"
                        title="Inspect Decoy Details & Payload"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onTestTripwire(decoy)}
                        className="cyber-btn cyber-btn-sm"
                        style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--cyber-amber)' }}
                        title="Simulate Attacker Interacting with this Decoy"
                      >
                        <Flame size={12} />
                        <span>Trip Trap</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy New Decoy Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} color="var(--cyber-cyan)" />
                <h3 style={{ fontSize: 18, color: '#fff' }}>DEPLOY NEW DECOY DIGITAL ASSET</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  DECOY ASSET NAME (Realistic File / Credential / Service)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2027_Executive_Mergers_Acquisitions.docx or aws_master_prod.json"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(8, 14, 28, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    CATEGORY
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(8, 14, 28, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  >
                    <option value="Honeyfile">Honeyfile (Decoy Document / Backup)</option>
                    <option value="Honeytoken">Honeytoken (Fake Credential / API Key)</option>
                    <option value="Endpoint">Decoy Endpoint (Emulated Port / Storage)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    TARGET NODE LOCATION
                  </label>
                  <select
                    value={formData.nodeId}
                    onChange={(e) => setFormData({ ...formData, nodeId: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(8, 14, 28, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.ip})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  TRIPWIRE DETECTION MECHANISM
                </label>
                <select
                  value={formData.tripwireType}
                  onChange={(e) => setFormData({ ...formData, tripwireType: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(8, 14, 28, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: 13,
                  }}
                >
                  <option value="Embedded DNS Webhook Beacon">Embedded DNS Webhook Beacon</option>
                  <option value="Cloud STS Access Alarm">Cloud STS Access Alarm</option>
                  <option value="Kerberoasting & LDAP Query Tripwire">Kerberoasting & LDAP Query Tripwire</option>
                  <option value="Poisoned Database Row Trigger">Poisoned Database Row Trigger</option>
                  <option value="SSH Honeypot Keystroke Logger">SSH Honeypot Keystroke Logger</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  REALISTIC DECOY CONTENT PREVIEW
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter synthetic decoy content, credentials, or instructions..."
                  value={formData.previewContent}
                  onChange={(e) => setFormData({ ...formData, previewContent: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(8, 14, 28, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cyber-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-btn cyber-btn-primary"
                >
                  <Sparkles size={14} />
                  <span>Deploy to Sensor Grid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
