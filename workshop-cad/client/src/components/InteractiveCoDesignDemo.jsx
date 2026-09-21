import React, { useState } from 'react';
import { Box, Cpu, Layers, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function InteractiveCoDesignDemo() {
  const [activeTab, setActiveTab] = useState('both');
  const [standoffHeight, setStandoffHeight] = useState(6.5); // mm
  const [activeLayer, setActiveLayer] = useState('top');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('IDX 3.0 Protocol Synced. 0 Geometric Collisions.');

  // Real engineering clearance check: Minimum required height for BGA + heat spreader is 4.8mm
  const isCollision = standoffHeight < 4.8;
  const clearanceGap = (standoffHeight - 4.2).toFixed(2);

  const triggerSync = () => {
    setIsSyncing(true);
    setSyncStatus('Pushing IDX 3.0 changeset between SolidWorks and Altium...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(`Sync Successful: ${standoffHeight.toFixed(1)}mm clearance locked into Altium 3D clearance envelope.`);
    }, 800);
  };

  return (
    <section id="simulator" style={{ padding: '90px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        <div className="pro-panel" style={{ padding: 'clamp(18px, 4vw, 36px)', border: '1px solid var(--border-medium)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <span className="tag-badge font-mono" style={{ marginBottom: '10px' }}>
                LIVE CAD VIEWPORT SIMULATOR
              </span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Bi-Directional ECAD-MCAD Clearance Inspector
              </h3>
              <p style={{ color: '#8c96a8', fontSize: '0.9rem', maxWidth: '580px', marginTop: '4px' }}>
                Adjust mechanical mounting boss height to verify how Altium Designer's 3D component keepouts react in real time.
              </p>
            </div>

            {/* Viewport View Toggles */}
            <div style={{ display: 'flex', gap: '8px', background: '#090a10', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('solidworks')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'solidworks' ? '#181b26' : 'transparent',
                  color: activeTab === 'solidworks' ? '#ff7a50' : '#778296',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Box size={14} color="#ff5722" />
                <span>SolidWorks Shell</span>
              </button>

              <button
                onClick={() => setActiveTab('altium')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'altium' ? '#181b26' : 'transparent',
                  color: activeTab === 'altium' ? '#00e5ff' : '#778296',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Cpu size={14} color="#00e5ff" />
                <span>Altium PCB</span>
              </button>

              <button
                onClick={() => setActiveTab('both')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'both' ? '#181b26' : 'transparent',
                  color: activeTab === 'both' ? '#ffffff' : '#778296',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={14} color="#a78bfa" />
                <span>Unified Cross-Section</span>
              </button>
            </div>
          </div>

          {/* Viewport Stage & Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 340px',
              gap: '24px',
              alignItems: 'stretch'
            }}
            className="demo-grid-mobile"
          >
            {/* Dark CAD Viewport Canvas */}
            <div
              style={{
                height: '360px',
                background: '#07080d',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* CAD Cross-Section Grid Lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* SolidWorks Aluminum Enclosure (Top) */}
              {(activeTab === 'solidworks' || activeTab === 'both') && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    width: '380px',
                    height: '80px',
                    border: '1.5px solid #ff5722',
                    borderBottom: 'none',
                    borderRadius: '12px 12px 0 0',
                    background: 'linear-gradient(180deg, rgba(255, 87, 34, 0.08) 0%, rgba(255, 87, 34, 0.02) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: `translateY(${-standoffHeight * 3.5 + 20}px)`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#ff7a50' }}>
                    <span className="font-mono">SOLIDWORKS // CNC 6061 ENCLOSURE</span>
                    <span className="font-mono">THICKNESS: 2.00mm</span>
                  </div>

                  {/* Cooling fin ribs */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map((fin) => (
                      <div key={fin} style={{ width: '3px', height: '22px', background: 'rgba(255, 87, 34, 0.35)', borderRadius: '1px' }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Mechanical Standoff Boss (Vertical Distance) */}
              {(activeTab === 'solidworks' || activeTab === 'both') && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      left: 'calc(50% - 160px)',
                      top: `calc(50% - ${standoffHeight * 3.5 / 2}px)`,
                      width: '12px',
                      height: `${standoffHeight * 7}px`,
                      background: '#e2b768',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(226, 183, 104, 0.3)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 'calc(50% - 160px)',
                      top: `calc(50% - ${standoffHeight * 3.5 / 2}px)`,
                      width: '12px',
                      height: `${standoffHeight * 7}px`,
                      background: '#e2b768',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(226, 183, 104, 0.3)'
                    }}
                  />
                </>
              )}

              {/* Altium High-Speed PCB (Bottom) */}
              {(activeTab === 'altium' || activeTab === 'both') && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '50px',
                    width: '380px',
                    height: '90px',
                    border: '1.5px solid #00e5ff',
                    borderRadius: '8px',
                    background: 'linear-gradient(180deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.02) 100%)',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#00e5ff' }}>
                    <span className="font-mono">ALTIUM // 12-LAYER ISOLA FR408HR</span>
                    <span className="font-mono">LAYER: {activeLayer.toUpperCase()}</span>
                  </div>

                  {/* BGA Processor package with solder balls */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <div
                      style={{
                        padding: '6px 18px',
                        background: '#121520',
                        border: isCollision ? '1.5px solid #ef4444' : '1.5px solid #00e5ff',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Cpu size={16} color={isCollision ? '#ef4444' : '#00e5ff'} />
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                        FPGA BGA [HEIGHT: 4.2mm]
                      </span>
                    </div>
                  </div>

                  {/* Mounting screw holes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #e2b768' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #e2b768' }} />
                  </div>
                </div>
              )}

              {/* Dimension Callout HUD */}
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '16px',
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  color: '#adb6c7'
                }}
              >
                DIM: {standoffHeight.toFixed(2)}mm [STANDOFF]
              </div>

              {/* Status Badge in Viewport */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: isCollision ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${isCollision ? '#ef4444' : '#10b981'}`,
                  color: isCollision ? '#fca5a5' : '#a7f3d0',
                  fontSize: '0.78rem'
                }}
              >
                {isCollision ? <AlertTriangle size={14} color="#ef4444" /> : <CheckCircle2 size={14} color="#10b981" />}
                <span className="font-mono">
                  {isCollision ? `COLLISION: -${Math.abs(clearanceGap)}mm interference detected` : `CLEARANCE GAP: +${clearanceGap}mm nominal`}
                </span>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Standoff Boss Height</label>
                    <span className="font-mono" style={{ fontSize: '0.85rem', color: '#e2b768', fontWeight: 700 }}>
                      {standoffHeight.toFixed(1)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="10.0"
                    step="0.5"
                    value={standoffHeight}
                    onChange={(e) => setStandoffHeight(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#ff5722', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#626d82', marginTop: '4px' }}>
                    <span>Min: 3.0mm</span>
                    <span>Nominal: 6.5mm</span>
                    <span>Max: 10.0mm</span>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label">Altium Copper Layer View</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'top', label: 'L1 Top Signal' },
                      { id: 'inner1', label: 'L2 Ground Plane' },
                      { id: 'inner2', label: 'L3 Power Rails' },
                      { id: 'bottom', label: 'L12 Bottom Signal' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setActiveLayer(l.id)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '7px',
                          fontSize: '0.78rem',
                          textAlign: 'left',
                          border: activeLayer === l.id ? '1px solid #00e5ff' : '1px solid var(--border-subtle)',
                          background: activeLayer === l.id ? 'rgba(0, 229, 255, 0.1)' : '#0a0b10',
                          color: activeLayer === l.id ? '#00e5ff' : '#8893a7',
                          cursor: 'pointer'
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={triggerSync}
                  disabled={isSyncing}
                  className="btn-secondary-pro"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.88rem' }}
                >
                  <RefreshCw size={14} className={isSyncing ? 'rotating' : ''} />
                  <span>{isSyncing ? 'Synchronizing...' : 'Simulate Bi-Directional IDX Sync'}</span>
                </button>

                <p style={{ fontSize: '0.75rem', color: '#626d82', marginTop: '8px', textAlign: 'center' }}>
                  In the lab, changes in SolidWorks push directly to Altium via native CoDesigner connector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
