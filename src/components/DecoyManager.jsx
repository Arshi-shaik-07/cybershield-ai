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
  FileSpreadsheet, 
  Trash2,
  UserCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { DECOY_PRESETS } from '../utils/initialData';

export default function DecoyManager({
  decoys = [],
  nodes = [],
  onDeployDecoy,
  onDeleteDecoy,
  onClearAllDecoys,
  onViewDecoy,
  onTestTripwire,
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a new custom decoy inserted by the owner or user
  const [formData, setFormData] = useState({
    name: '',
    insertedBy: 'Owner (You)',
    category: 'Honeyfile',
    nodeId: 'node-workstation',
    type: 'Canary Document',
    tripwireType: 'Embedded DNS Webhook Beacon',
    realismScore: 98,
    fileSize: '1.8 MB',
    description: '',
    previewContent: '',
  });

  const filteredDecoys = decoys.filter(decoy => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'HONEYFILE' && decoy.category === 'Honeyfile') ||
      (activeFilter === 'HONEYTOKEN' && decoy.category === 'Honeytoken') ||
      (activeFilter === 'ENDPOINT' && decoy.category === 'Endpoint');

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      decoy.name?.toLowerCase().includes(query) ||
      decoy.type?.toLowerCase().includes(query) ||
      decoy.insertedBy?.toLowerCase().includes(query) ||
      decoy.tripwireType?.toLowerCase().includes(query);

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
      id: `owner-decoy-${Date.now().toString(36)}`,
      fileSize: formData.category === 'Honeyfile' ? formData.fileSize || '1.8 MB' : 'N/A',
      canaryToken: `cnry-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Armed',
      triggersCount: 0,
      lastTriggered: null,
      insertedBy: formData.insertedBy || 'Owner (You)',
      createdAt: new Date().toISOString(),
    };

    onDeployDecoy(newDecoy);
    setIsModalOpen(false);
    setFormData({
      name: '',
      insertedBy: 'Owner (You)',
      category: 'Honeyfile',
      nodeId: 'node-workstation',
      type: 'Canary Document',
      tripwireType: 'Embedded DNS Webhook Beacon',
      realismScore: 98,
      fileSize: '1.8 MB',
      description: '',
      previewContent: '',
    });
  };

  const handleDeployPreset = (preset) => {
    const newDecoy = {
      ...preset,
      id: `owner-decoy-${Date.now().toString(36)}`,
      insertedBy: 'Owner (You)',
      canaryToken: `cnry-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Armed',
      triggersCount: 0,
      lastTriggered: null,
      createdAt: new Date().toISOString(),
    };
    onDeployDecoy(newDecoy);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Honeyfile':
        return <FileSpreadsheet size={16} color="#0284c7" />;
      case 'Honeytoken':
        return <Key size={16} color="#d97706" />;
      case 'Endpoint':
        return <Server size={16} color="#7c3aed" />;
      default:
        return <FileText size={16} color="#0284c7" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}>
        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>INSERTED DECOYS</span>
            <ShieldCheck size={18} color="#059669" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            {decoys.length}
          </div>
          <p style={{ fontSize: 11, color: '#059669', marginTop: 4, fontWeight: 600 }}>
            {decoys.length === 0 ? 'NO DEMO RECORDS • AWAITING OWNER INSERT' : 'AUTHENTIC OWNER-INSERTED ASSETS'}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>LIVE TRIPWIRE ALARMS</span>
            <Flame size={18} color="#dc2626" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626', marginTop: 8 }}>
            {decoys.reduce((sum, d) => sum + (d.triggersCount || 0), 0)}
          </div>
          <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4, fontWeight: 600 }}>
            REAL-TIME INTRUSION TRIPS
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>RECORD SOURCE</span>
            <UserCheck size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0284c7', marginTop: 12 }}>
            Owner / User Defined
          </div>
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
            0 DEMO MOCKS • LIVE STORAGE
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>ACTION</span>
            <Plus size={18} color="#d97706" />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cyber-btn cyber-btn-primary"
              style={{ flex: 1, padding: '10px 12px' }}
            >
              <Plus size={16} />
              <span>Insert Decoy</span>
            </button>
            {decoys.length > 0 && onClearAllDecoys && (
              <button
                onClick={onClearAllDecoys}
                className="cyber-btn cyber-btn-sm"
                style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                title="Clear all inserted decoys"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Decoy Inventory Panel */}
      <div className="glass-panel" style={{ padding: 20, background: '#ffffff' }}>
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
              placeholder="Search inserted decoys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid var(--border-strong)',
                borderRadius: 6,
                padding: '7px 10px 7px 32px',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* When no decoys are inserted yet: Clean Empty State */}
        {filteredDecoys.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            background: '#f8fafc',
            border: '2px dashed var(--border-strong)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #bae6fd',
            }}>
              <Layers size={24} color="#0284c7" />
            </div>

            <div>
              <h3 style={{ fontSize: 17, color: 'var(--text-primary)', fontWeight: 700 }}>
                {searchQuery ? 'No Decoys Match Your Search' : 'No Decoy Records Deployed Yet'}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, maxWidth: 500 }}>
                All static demo records have been removed. You (or any authorized user) can now insert realistic decoy assets directly into the simulated network.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cyber-btn cyber-btn-primary"
              >
                <Plus size={15} />
                <span>Insert Custom Decoy Asset</span>
              </button>

              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or Quick Deploy Template:</span>

              {DECOY_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDeployPreset(p)}
                  className="cyber-badge"
                  style={{
                    cursor: 'pointer',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '6px 10px',
                    fontSize: 11,
                    color: '#0284c7',
                    fontWeight: 600,
                  }}
                  title={`Deploy ${p.name}`}
                >
                  <Zap size={12} color="#0284c7" />
                  <span>+ {p.name.split('.')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Decoys Table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', background: '#f8fafc', color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                  <th style={{ padding: '12px 14px' }}>DECOY ASSET</th>
                  <th style={{ padding: '12px 14px' }}>INSERTED BY</th>
                  <th style={{ padding: '12px 14px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 14px' }}>LOCATION NODE</th>
                  <th style={{ padding: '12px 14px' }}>TRIPWIRE MECHANISM</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDecoys.map((decoy) => (
                  <tr
                    key={decoy.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: 6,
                          background: '#f1f5f9',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {getCategoryIcon(decoy.category)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
                            {decoy.name}
                          </div>
                          <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            TOKEN: {decoy.canaryToken}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: 10, fontWeight: 700 }}>
                        👤 {decoy.insertedBy || 'Owner'}
                      </span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span className="cyber-badge" style={{ fontSize: 10 }}>
                        {decoy.category}
                      </span>
                    </td>

                    <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {getNodeName(decoy.nodeId)}
                    </td>

                    <td style={{ padding: '14px', fontSize: 12, color: '#0284c7', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {decoy.tripwireType}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span className={`cyber-badge ${decoy.triggersCount > 0 ? 'cyber-badge-crimson' : 'cyber-badge-emerald'}`}>
                        {decoy.triggersCount > 0 ? `TRIPPED (${decoy.triggersCount})` : 'ARMED'}
                      </span>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
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
                          style={{ borderColor: '#fde68a', background: '#fffbeb', color: '#b45309' }}
                          title="Simulate Attacker Interacting with this Decoy"
                        >
                          <Flame size={12} />
                          <span>Trip Trap</span>
                        </button>

                        <button
                          onClick={() => onDeleteDecoy(decoy.id)}
                          className="cyber-btn cyber-btn-sm"
                          style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                          title="Remove Decoy Record"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deploy New Decoy Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} color="#0284c7" />
                <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>INSERT NEW DECOY ASSET (OWNER / USER)</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    DECOY ASSET NAME (File, Credential, or Service)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2027_Executive_M&A_Strategy.docx or db_root_prod.env"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    INSERTED BY (OWNER / USER)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Owner (You)"
                    value={formData.insertedBy}
                    onChange={(e) => setFormData({ ...formData, insertedBy: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    CATEGORY
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  >
                    <option value="Honeyfile">Honeyfile (Decoy Document / Backup)</option>
                    <option value="Honeytoken">Honeytoken (Fake Credential / API Key)</option>
                    <option value="Endpoint">Decoy Endpoint (Emulated Port / Storage)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    TARGET NODE LOCATION
                  </label>
                  <select
                    value={formData.nodeId}
                    onChange={(e) => setFormData({ ...formData, nodeId: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
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
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                  TRIPWIRE DETECTION MECHANISM
                </label>
                <select
                  value={formData.tripwireType}
                  onChange={(e) => setFormData({ ...formData, tripwireType: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
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
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                  REALISTIC DECOY CONTENT PREVIEW
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter realistic decoy content, credentials, or instructions..."
                  value={formData.previewContent}
                  onChange={(e) => setFormData({ ...formData, previewContent: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
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
                  <span>Insert to Sensor Grid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
