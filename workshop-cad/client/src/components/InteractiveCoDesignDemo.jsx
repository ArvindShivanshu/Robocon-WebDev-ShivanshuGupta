import React, { useState } from 'react';
import { Box, Cpu, Layers, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DecryptedText, SpecularButton } from './reactbits';

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
    <section id="simulator" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        <div className="pro-panel" style={{ padding: 'clamp(18px, 3.5vw, 32px)', border: '1px solid var(--border-subtle)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span className="tag-badge font-mono" style={{ marginBottom: '10px' }}>
                <DecryptedText text="SIMULATOR // CO-DESIGN CLEARANCE" speed={25} maxIterations={10} animateOn="view" />
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 750, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Bi-Directional ECAD-MCAD Clearance Inspector
              </h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', maxWidth: '580px', marginTop: '4px' }}>
                Adjust mechanical mounting boss height to verify how Altium Designer's 3D component keepouts react in real time.
              </p>
            </div>

            {/* Viewport View Toggles */}
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('solidworks')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'solidworks' ? '#ffffff' : 'transparent',
                  color: activeTab === 'solidworks' ? '#ea580c' : '#64748b',
                  boxShadow: activeTab === 'solidworks' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Box size={14} color="#ea580c" />
                <span>SolidWorks Shell</span>
              </button>

              <button
                onClick={() => setActiveTab('altium')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'altium' ? '#ffffff' : 'transparent',
                  color: activeTab === 'altium' ? '#0284c7' : '#64748b',
                  boxShadow: activeTab === 'altium' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Cpu size={14} color="#0284c7" />
                <span>Altium PCB</span>
              </button>

              <button
                onClick={() => setActiveTab('both')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'both' ? '#ffffff' : 'transparent',
                  color: activeTab === 'both' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'both' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={14} color="#7c3aed" />
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
                    <span className="font-mono" style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700 }}>
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
                    style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
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
                          border: activeLayer === l.id ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                          background: activeLayer === l.id ? '#e0f2fe' : '#f8fafc',
                          color: activeLayer === l.id ? '#0284c7' : '#64748b',
                          cursor: 'pointer',
                          fontWeight: activeLayer === l.id ? 600 : 400
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <SpecularButton
                  variant="secondary"
                  onClick={triggerSync}
                  disabled={isSyncing}
                  style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.88rem' }}
                >
                  <RefreshCw size={14} className={isSyncing ? 'rotating' : ''} />
                  <span>{isSyncing ? 'Synchronizing...' : 'Simulate Bi-Directional IDX Sync'}</span>
                </SpecularButton>

                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
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
